import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, Platform } from "react-native";
import { WebView } from 'react-native-webview';

export default function DevToolsWebView() {
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isInspecting, setIsInspecting] = useState(false);
  const webViewRef = useRef(null);

  // Inyectar los scripts de DevTools
  const devToolsScript = `
    // Eruda DevTools
    (function () { 
      var script = document.createElement('script');
      script.src = "//cdn.jsdelivr.net/npm/eruda";
      document.body.appendChild(script);
      script.onload = function () { 
        eruda.init();
        eruda.show();
      }
    })();

    // Habilitar inspección de elementos
    document.addEventListener('click', function(e) {
      if (window.inspectMode) {
        e.preventDefault();
        const element = e.target;
        console.log('Element:', element);
        console.log('HTML:', element.outerHTML);
        console.log('CSS:', window.getComputedStyle(element));
      }
    });
  `;

  const handleUrlSubmit = () => {
    if (inputUrl) {
      const validUrl = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
      setCurrentUrl(validUrl);
      setHistory([...history, validUrl]);
      setInputUrl('');
    }
  };

  const reloadPage = () => {
    webViewRef.current?.reload();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="Ingresa una URL"
          onSubmitEditing={handleUrlSubmit}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleUrlSubmit}>
          <Text style={styles.buttonText}>IR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={reloadPage}>
          <Text style={styles.toolButtonText}>🔄 Recargar</Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.historyContainer}>
        {history.map((url, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.historyItem}
            onPress={() => setCurrentUrl(url)}
          >
            <Text numberOfLines={1} style={styles.historyText}>{url}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>

      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webview}
          injectedJavaScript={devToolsScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
          allowUniversalAccessFromFileURLs={true}
          allowFileAccess={true}
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    backgroundColor: '#f5f5f5',
  },
  toolbarContainer: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#e5e5e5',
    justifyContent: 'space-around',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toolButton: {
    backgroundColor: '#4a4a4a',
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  toolButtonActive: {
    backgroundColor: '#007AFF',
  },
  toolButtonText: {
    color: 'white',
    fontSize: 12,
  },
  historyContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    maxWidth: 200,
  },
  historyText: {
    fontSize: 12,
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  }
});