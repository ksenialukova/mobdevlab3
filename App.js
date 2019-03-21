import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import {SQLite} from "expo";
import {createStackNavigator, createAppContainer} from 'react-navigation';


const db = SQLite.openDatabase('db.db');

class Home extends React.Component {

    static navigationOptions =
  {
     title: 'Home',
  };

    constructor(props){
        super(props);
        this.state = {
            checkbox1: false,
            checkbox2: false,
            radiobutton: 'triangle',
            output: '',
            allData: ''
        };
    }

    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists Choise (id integer primary key not null, value text);'
            );
        });
    }


    handlePress = (event) => {
        let output = '';

        if (this.state.checkbox1) {
            output += 'square ';
        }

        if (this.state.checkbox2) {
            output += 'perimetr ';
        }

        output += this.state.radiobutton;

        this.add(output);
        output = 'Successful add: ' + output;
        this.setState({output: output});
    };

    add(text) {
        db.transaction(
            tx => {
                tx.executeSql('insert into Choise (value) values (?)', [text]);
                },
            null
        );
    }

    handlePressData = (navigate) => {
        db.transaction(tx => {
            tx.executeSql('select * from Choise', [], (_, {rows: {_array}}) => {
                if (JSON.stringify(_array).length > 2){
                    this.setState({allData: JSON.stringify(_array)})
                }else{
                    this.setState({allData: 'No records'})
                }
                navigate('ViewActivity', {allData: this.state.allData})
                },
                null
            );
        }
        )
    };

    handlePressDelete = () => {
        db.transaction(
            tx => {
                tx.executeSql(`delete from Choise;`);
                },
            null
        )
    };

  render() {
      let allData = this.state.allData;
      const {navigate} = this.props.navigation;
      return (
          <View style={styles.container}>
              <Text>Choose figure and options</Text>
              <CheckBox
                  title='Square'
                  checked={this.state.checkbox1}
                  onPress={() => this.setState({checkbox1: !this.state.checkbox1})}
              />
              <CheckBox
                  title='Perimetr'
                  checked={this.state.checkbox2}
                  onPress={() => this.setState({checkbox2: !this.state.checkbox2})}
              />
              <Text>Triangle</Text>
              <RadioButton
                  value='Triangle'
                  status={this.state.radiobutton === 'triangle' ? 'checked' : 'unchecked'}
                  onPress={() => this.setState({radiobutton: 'triangle'})}
              />
              <Text>Rectangle</Text>
              <RadioButton
                  value='Rectangle'
                  status={this.state.radiobutton === 'rectangle' ? 'checked' : 'unchecked'}
                  onPress={() => this.setState({radiobutton: 'rectangle'})}
              />
              <Text>Circle</Text>
              <RadioButton
                  value='Circle'
                  status={this.state.radiobutton === 'circle' ? 'checked' : 'unchecked'}
                  onPress={() => this.setState({radiobutton: 'circle'})}
              />
              <Button
                  title='Submit'
                  onPress={this.handlePress}
              />
              <Text>{this.state.output}</Text>
              <Button
                  title='All data'
                  onPress={() => {
                      this.handlePressData(navigate);
                  }}
              />
              <Button
                  title='Delete'
                  onPress={this.handlePressDelete}
              />
              <Text>{this.state.allData}</Text>
          </View>
      )
  }
}

class ViewActivity extends React.Component{
    static navigationOptions =
  {
     title: 'ViewActivity',
  };

    render()
  {
      const {navigate} = this.props.navigation;
     return(
        <View>
            <Text>{this.props.navigation.state.params.allData}</Text>
            <Button title='Back' onPress={() => navigate('Home')}/>
        </View>
     );
  }

}


const ActivityProject = createStackNavigator(
{
  Home: { screen: Home },

  ViewActivity: { screen: ViewActivity }
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



const App = createAppContainer(ActivityProject);

export default App;