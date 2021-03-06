/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    Image,
    StatusBar,
    BackHandler,
    Keyboard,
    Linking
} from 'react-native';
import styles, {screenHeight, screenWidth} from "../style"
import * as Constant from "../style/constant"
import PropTypes from 'prop-types';
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Modal from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome'
import {Fumi} from 'react-native-textinput-effects';
import Toast from './common/ToastProxy'

const animaTime = 600;

/**
 * 登陆Modal
 */
class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.userInputChange = this.userInputChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.params = {
            userName: '',
            password: ''
        };
        this.state = {
            saveUserName: '',
            savePassword: '',
            opacity: new Animated.Value(0),
        }
    }

    componentDidMount() {
        this.onOpen();
        this.handle = BackHandler.addEventListener('hardwareBackPress-LoginPage', this.onClose)
        Animated.timing(this.state.opacity, {
            duration: animaTime,
            toValue: 1,
        }).start();
    }

    componentWillUnmount() {
        if (this.handle) {
            this.handle.remove();
        }
    }


    onOpen() {
        loginActions.getLoginParams().then((res) => {
            this.setState({
                saveUserName: res.userName,
                savePassword: res.password
            });
            this.params.userName = res.userName;
            this.params.password = res.password;
        });
    }

    onClose() {
        if (Actions.state.index === 0) {
            return false;
        }
        Animated.timing(this.state.opacity, {
            duration: animaTime,
            toValue: 0,
        }).start(Actions.pop());
        return true;

    }

    userInputChange(text) {
        this.params.userName = text;
    }

    passwordChange(text) {
        this.params.password = text;
    }

    exitLoading() {
        if (Actions.currentScene === 'LoadingModal') {
            Actions.pop();
        }
    }

    toLogin() {
        let {login} = this.props;
        if (!this.params.userName || this.params.userName.length === 0) {
            Toast(I18n('LoginNameTip'));
            return
        }
        if (!this.params.password || this.params.password.length === 0) {
            Toast(I18n('LoginPWTip'));
            return
        }
        this.setState({
            saveUserName: this.params.userName,
            savePassword: this.params.password
        });
        Actions.LoadingModal({backExit: false});
        Keyboard.dismiss();
        login.doLogin(this.params.userName, this.params.password, (res) => {
            this.exitLoading();
            if (!res) {
                Toast(I18n('LoginFailTip'));
            } else {
                Actions.reset("mainTabPage")
            }
        })
    }

    render() {
        let textInputProps = {
            style: {width: 250, height: 70, backgroundColor: Constant.miWhite},
            activeColor: Constant.primaryColor,
            passiveColor: '#dadada',
            iconClass: Icon,
            iconColor: Constant.primaryColor,
            iconSize: 25,
            clearButtonMode: "always"
        };
        return (
            <Animated.View
                style={[styles.centered, styles.absoluteFull, {backgroundColor: Constant.primaryColor}, {opacity: this.state.opacity}]}>
                <StatusBar hidden={false} backgroundColor={Constant.primaryColor} translucent
                           barStyle={'light-content'}/>
                <View
                    style={[{backgroundColor: Constant.miWhite}, {
                        height: 360,
                        width: screenWidth - 80,
                        margin: 50,
                        borderRadius: 10
                    }]}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Image source={require("../img/logo.png")}
                               resizeMode={"center"}
                               style={{width: 80, height: 80}}/>
                    </View>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={"userNameInput"}
                            {...textInputProps}
                            label={I18n('UserName')}
                            iconName={'user-circle-o'}
                            value={this.state.saveUserName}
                            onChangeText={this.userInputChange}
                        />
                    </View>
                    <View style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}>
                        <Fumi
                            ref={"passwordInput"}
                            {...textInputProps}
                            label={I18n('Password')}
                            returnKeyType={'send'}
                            secureTextEntry={true}
                            password={true}
                            iconName={'keyboard-o'}
                            value={this.state.savePassword}
                            onChangeText={this.passwordChange}
                        />
                    </View>
                    <View>
                    </View>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}
                                      onPress={() => {
                                          this.toLogin();
                                      }}>
                        <View
                            style={[styles.centered, {
                                backgroundColor: Constant.primaryColor,
                                width: 230,
                                marginTop: Constant.normalMarginEdge,
                                paddingHorizontal: Constant.normalMarginEdge,
                                paddingVertical: Constant.normalMarginEdge,
                                borderRadius: 5
                            }]}>
                            <Text style={[styles.normalTextWhite]}>{I18n('Login')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.centered, {marginTop: Constant.normalMarginEdge}]}
                                      onPress={() => {
                                          Linking.openURL("https://github.com/join")
                                      }}>
                        <Text
                            style={[styles.subSmallText,]}>{" " + I18n('register') + " "}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

export default connect(state => ({state}), dispatch => ({
        login: bindActionCreators(loginActions, dispatch)
    })
)(LoginPage)