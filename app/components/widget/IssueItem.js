/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import TimeText from './TimeText'
import UserImage from './UserImage'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'

/**
 * Issue列表Item
 */
class IssueItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {actionTime, actionUser, actionUserPic, issueComment} = this.props;
        return (
            <TouchableOpacity
                style={[{
                    marginTop: Constant.normalMarginEdge,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    paddingHorizontal: Constant.normalMarginEdge,
                    paddingTop: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard]}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }} >
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <UserImage uri={actionUserPic}
                               loginUser={actionUser}
                               resizeMethod="scale"
                               style={[{
                                   height: Constant.normalIconSize, width: Constant.normalIconSize,
                                   marginTop: 5,
                                   borderRadius: Constant.normalIconSize / 2
                               }]}/>
                    <View style={{flex: 1, marginLeft: Constant.normalMarginEdge}}>
                        <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                            <Text style={[styles.flex, styles.normalText, {fontWeight: "bold",}]}>
                                {actionUser}
                            </Text>
                            <TimeText style={[styles.subSmallText, {marginTop: -3}]}
                                      time={actionTime}/>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge / 2}]}>
                            <Text style={[styles.subSmallText,]}>{issueComment}</Text>
                        </View>
                        <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                            <IconC name={this.props.state === 'open' ? "issue-opened" : "issue-closed"}
                                   backgroundColor={Constant.transparentColor}
                                   color={Constant.subLightTextColor} size={14}>
                                <Text style={[styles.subLightSmallText]}>
                                    {this.props.state + " "}
                                </Text>
                            </IconC>
                            <Text style={[styles.subLightSmallText, {flex: 1}]}
                                  numberOfLines={Constant.normalNumberOfLine}>
                                {this.props.issueTag}
                            </Text>
                            <Icon.Button name="comment"
                                         iconStyle={{marginRight: 3}}
                                         backgroundColor={Constant.transparentColor}
                                         color={Constant.subLightTextColor} size={10}>
                                <Text style={[styles.subLightSmallText, {fontSize: Constant.minTextSize}]}>
                                    {this.props.commentCount}
                                </Text>
                            </Icon.Button>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.string,
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    issueComment: PropTypes.string,
    issueTag: PropTypes.string,
    onPressItem: PropTypes.func,
    commentCount: PropTypes.string,
};

IssueItem.propTypes = propTypes;

export default IssueItem