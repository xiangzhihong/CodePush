/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import codePush from 'cpcn-react-native/CodePush';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [upgradeState, setUpgradeState] = React.useState(0);
  const [upgradeReceived, setUpgradeReceived] = React.useState(0);
  const [upgradeAllBytes, setUpgradeAllBytes] = React.useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    checkUpdate();
  }, []);

  function checkUpdate() {
    codePush.check({
      //检查是否有新版本后调用此方法
      checkCallback: (remotePackage, agreeContinueFun) => {
        console.log('checkCallback', remotePackage.toString());
        if (remotePackage) {
          //如果remotePackage 有值，表示有新版本可更新。
          setUpgradeState(1);
        }
      },
      //下载新版本时调用此方法
      downloadProgressCallback: dp => {
        console.log('downloadProgressCallback>>>');
        // 更新显示的下载进度中的数值
        setUpgradeReceived(dp.receivedBytes); //已下载的字节数
        setUpgradeAllBytes(dp.totalBytes); //总共需下载的字节数
      },
      //安装新版本后调用此方法
      installedCallback: restartFun => {
        console.log('installedCallback>>>');
        //新版本安装成功,关闭对话框
        setUpgradeState(0);
        restartFun(true);
        alert('安装成功,关闭对话框');
      },
    });
  }

  function upgradeContinue() {
    codePush.agreeContinue(true);
    //将upgradeState的值设为2，以显示下载进度
    setUpgradeState(2);
  }

  function renderUpdateModal() {
    return (
      <Modal visible={upgradeState > 0} transparent={true}>
        <View style={styles.modal}>
          <View style={styles.content}>
            {upgradeState == 1 && (
              <View>
                <Text style={styles.tip}>发现新版本</Text>
                <Text style={styles.des}>检测到新版本，点击按钮执行更新！</Text>
                <Button title="马上更新" onPress={upgradeContinue} />
              </View>
            )}
            {upgradeState == 2 && (
              <View>
                <Text style={{textAlign: 'center'}}>
                  {upgradeReceived} / {upgradeAllBytes}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
        {renderUpdateModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  modal: {
    padding: 25,
    backgroundColor: 'rgba(10,10,10,0.6)',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 18,
  },
  tip: {
    paddingBottom: 20,
    textAlign: 'center',
    fontSize: 22,
  },
  des: {
    paddingBottom: 20,
  },
});

export default App;
