import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    Image

} from 'react-native';

//拿到本地的数据
const localData = require('./localData/Car.json').data;

export default class App2 extends Component {
  constructor(props) {
    super(props);

    //定义获取行数据的规则(注意, 在clone数据的时候,传入的参数的数据结构, 要按着这里的规则设计)
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[sectionID + ":" + rowID];

    //定义获取组数据的规则
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];

    this.state = {
      ds: new ListView.DataSource({
        getSectionData,
        getRowData,
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }

  }

  render() {
    return (
        <ListView
            dataSource={this.state.ds}
            renderSectionHeader={this._renderSectionHeader}
            renderRow={this._renderRow}
        />
    )
  }

  componentDidMount() {
    const dataBlob = {}, sectionIDs = [], rowIDs = [];
    let cars = [];

    localData.forEach((value, index) => {
      dataBlob[index] = value.title;
      sectionIDs[index] = index;

      //rowIDs是个二维数组,这里定义它里面的一维数组, 对应的是组的个数 
      rowIDs[index] = [];

      //cars是每组的所有行数据
      cars = value.cars;
      cars.forEach((rowValue, rowID) => {
        //按着 实例化数据源时候设定的数据结构, 完成dataBlob的数据结构组装
        dataBlob[index + ":" + rowID] = rowValue;

        //rowIDs是个二维数组(即数组里装的元素还是数组), 一维数组的个数对应着组的个数, 具体的每个一维数组里面放的是每组的行的下标 
        rowIDs[index].push(rowID);
      })
    });




    this.setState({
      ds: this.state.ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
    })
  }

  _renderSectionHeader(sectionData) {
    return (
        <View style={styles.sectionHeader}>
          <Text style={styles.headerText}>{sectionData}</Text>
        </View>
    )
  }

  _renderRow(rowData) {
    return (
        <View style={styles.row}>
          <Image source={{uri: rowData.icon}} style={styles.img} />
          <Text>{rowData.name}</Text>
        </View>
    )
  }

}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: "skyblue",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginTop: 10
  },
  img: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingTop: 10,

  }

});
