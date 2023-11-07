---
title: Immersive Reader Swift client library quickstart 
titleSuffix: Azure AI services
description: In this quickstart, you build a iOS app from scratch and add the Immersive Reader API functionality.
services: cognitive-services
author: rwallerms
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 09/14/2020
ms.author: rwaller
---

[Immersive Reader](https://www.onenote.com/learningtools) is an inclusively designed tool that implements proven techniques to improve reading comprehension for new readers, language learners, and people with learning differences such as dyslexia. You can use Immersive Reader in your applications to isolate text to improve focus, display pictures for commonly used words, highlight parts of speech, read selected text out loud, translate words and phrases in real-time, and more.

In this quickstart, you build an iOS app from scratch and integrate the Immersive Reader. A full working sample of this quickstart is available [here](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/ios).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up. You will need some of the values created here when configuring the sample project properties. Save the output of your session into a text file for future reference.

## Create an Xcode project

Create a new project in Xcode.

![New Project - Swift](../../media/ios/xcode-create-project.png)

Choose **Single View App**.

![New Single View App - Swift](../../media/ios/xcode-single-view-app.png)

## Set up authentication

In the top menu, select **Product > Scheme > Edit Scheme...**.

![Edit Scheme - Swift](../../media/ios/quickstart-ios-edit-scheme.png)

In the **Run** view, select **Arguments** tab.

![Edit Scheme environment variables - Swift](../../media/ios/quickstart-ios-env-vars.png)

In the **Environment Variables** section, add the following names and values, supplying the values given when you created your Immersive Reader resource.

> [!IMPORTANT]
> Remember to never post secrets publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md).

```text
TENANT_ID=<YOUR_TENANT_ID>
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET<YOUR_CLIENT_SECRET>
SUBDOMAIN=<YOUR_SUBDOMAIN>
```

## Set up the app to run without a storyboard

Open *AppDelegate.swift* and replace the file with the following code.

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    var navigationController: UINavigationController?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.

        window = UIWindow(frame: UIScreen.main.bounds)

        if let window = window {
            let mainViewController = LaunchViewController()
            navigationController = UINavigationController(rootViewController: mainViewController)
            window.rootViewController = navigationController
            window.makeKeyAndVisible()
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
}
```

## Create the view controllers and add sample content

Rename *ViewController.swift* to *LaunchViewController.swift* and replace the file with the following code.

```swift
import UIKit

class LaunchViewController: UIViewController {
    private var tenantId = ProcessInfo.processInfo.environment["TENANT_ID"]
    private var clientId = ProcessInfo.processInfo.environment["CLIENT_ID"]
    private var clientSecret = ProcessInfo.processInfo.environment["CLIENT_SECRET"]
    private var subdomain = ProcessInfo.processInfo.environment["SUBDOMAIN"]

    private var launchButton: UIButton!
    private var titleText: UILabel!
    private var bodyText: UILabel!
    private var sampleContent: Content!
    private var sampleChunk: Chunk!
    private var sampleOptions: Options!

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .white

        titleText = UILabel()
        titleText.text = "Geography"
        titleText.font = UIFont.boldSystemFont(ofSize: 30)
        titleText.lineBreakMode = .byWordWrapping
        titleText.numberOfLines = 0
        view.addSubview(titleText)

        bodyText = UILabel()
        bodyText.text = "The study of Earth's landforms is called physical geography. Landforms can be mountains and valleys. They can also be glaciers, lakes or rivers. Landforms are sometimes called physical features. It is important for students to know about the physical geography of Earth. The seasons, the atmosphere and all the natural processes of Earth affect where people are able to live. Geography is one of a combination of factors that people use to decide where they want to live.The physical features of a region are often rich in resources. Within a nation, mountain ranges become natural borders for settlement areas. In the U.S., major mountain ranges are the Sierra Nevada, the Rocky Mountains, and the Appalachians.Fresh water sources also influence where people settle. People need water to drink. They also need it for washing. Throughout history, people have settled near fresh water. Living near a water source helps ensure that people have the water they need. There was an added bonus, too. Water could be used as a travel route for people and goods. Many Americans live near popular water sources, such as the Mississippi River, the Colorado River and the Great Lakes.Mountains and deserts have been settled by fewer people than the plains areas. However, they have valuable resources of their own."
        bodyText.lineBreakMode = .byWordWrapping
        bodyText.numberOfLines = 0
        let screenSize = self.view.frame.height
        if screenSize <= 667 {
            // Font size for smaller iPhones.
            bodyText.font = bodyText.font.withSize(14)

         } else if screenSize <= 812 {
            // Font size for medium iPhones.
            bodyText.font = bodyText.font.withSize(15)

         } else if screenSize <= 896 {
            // Font size for larger iPhones.
            bodyText.font = bodyText.font.withSize(17)

         } else if screenSize <= 1024 {
            // Font size for iPads.
            bodyText.font = bodyText.font.withSize(25)
        } else {
            // Font size for large iPads.
            bodyText.font = bodyText.font.withSize(28)
        }
        view.addSubview(bodyText)

        launchButton = UIButton()
        launchButton.backgroundColor = .darkGray
        launchButton.contentEdgeInsets = UIEdgeInsets(top: 10, left: 10, bottom: 10, right: 10)
        launchButton.setTitleColor(.white, for: .normal)
        launchButton.setTitle("Immersive Reader", for: .normal)
        launchButton.addTarget(self, action: #selector(launchImmersiveReaderButton(sender:)), for: .touchUpInside)
        view.addSubview(launchButton)

        let layoutGuide = view.safeAreaLayoutGuide

        titleText.translatesAutoresizingMaskIntoConstraints = false
        titleText.topAnchor.constraint(equalTo: layoutGuide.topAnchor, constant: 20).isActive = true
        titleText.leadingAnchor.constraint(equalTo: layoutGuide.leadingAnchor, constant: 20).isActive = true
        titleText.trailingAnchor.constraint(equalTo: layoutGuide.trailingAnchor, constant: -20).isActive = true

        bodyText.translatesAutoresizingMaskIntoConstraints = false
        bodyText.topAnchor.constraint(equalTo: titleText.bottomAnchor, constant: 15).isActive = true
        bodyText.leadingAnchor.constraint(equalTo: layoutGuide.leadingAnchor, constant: 20).isActive = true
        bodyText.trailingAnchor.constraint(equalTo: layoutGuide.trailingAnchor, constant: -20).isActive = true

        launchButton.translatesAutoresizingMaskIntoConstraints = false
        launchButton.widthAnchor.constraint(equalToConstant: 200).isActive = true
        launchButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
        launchButton.centerXAnchor.constraint(equalTo: layoutGuide.centerXAnchor).isActive = true
        launchButton.bottomAnchor.constraint(equalTo: layoutGuide.bottomAnchor, constant: -10).isActive = true

        // Create content and options.
        sampleChunk = Chunk(content: bodyText.text!, lang: nil, mimeType: nil)
        sampleContent = Content(title: titleText.text!, chunks: [sampleChunk])
        sampleOptions = Options(uiLang: nil, timeout: nil, uiZIndex: nil)
    }

    @IBAction func launchImmersiveReaderButton(sender: AnyObject) {
        launchButton.isEnabled = false

        // Callback to get token.
        getToken(onSuccess: {cognitiveToken in
            DispatchQueue.main.async {
                launchImmersiveReader(navController: self.navigationController!, token: cognitiveToken, subdomain: self.subdomain!, content: self.sampleContent, options: self.sampleOptions, onSuccess: {
                    self.launchButton.isEnabled = true
                }, onFailure: { error in
                    self.launchButton.isEnabled = true
                })
            }
        }, onFailure: { error in
            print("an error occurred: \(error)")
        })
    }

    func getToken(onSuccess: @escaping (_ theToken: String) -> Void, onFailure: @escaping ( _ theError: String) -> Void) {
        let tokenForm = "grant_type=client_credentials&resource=https://cognitiveservices.azure.com/&client_id=" + self.clientId! + "&client_secret=" + self.clientSecret!
        let tokenUrl = "https://login.windows.net/" + self.tenantId! + "/oauth2/token"

        var responseTokenString: String = "0"

        let url = URL(string: tokenUrl)!
        var request = URLRequest(url: url)
        request.httpBody = tokenForm.data(using: .utf8)
        request.httpMethod = "POST"

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data,
                let response = response as? HTTPURLResponse,
                error == nil else {
                    onFailure("Error")
                    return
                }

            guard (200 ... 299) ~= response.statusCode else {
                onFailure(String(response.statusCode))
                return
            }

            let responseString = String(data: data, encoding: .utf8)

            let jsonResponse = try? JSONSerialization.jsonObject(with: data, options: [])
            guard let jsonDictonary = jsonResponse as? [String: Any] else {
                onFailure("Error parsing JSON response.")
                return
            }
            guard let responseToken = jsonDictonary["access_token"] as? String else {
                onFailure("Error retrieving token from JSON response.")
                return
            }
            responseTokenString = responseToken
            onSuccess(responseTokenString)
        }

        task.resume()
    }
}
```

Add a new file to the project root folder named *ImmersiveReaderViewController.swift* and add the following code.

```swift
import UIKit
import Foundation
import WebKit

@available(iOS 11.0, *)
public class ImmersiveReaderWebView: WKWebView {

    init(frame: CGRect, contentController: WKUserContentController) {
        let conf = WKWebViewConfiguration()
        conf.userContentController = contentController
        super.init(frame: frame, configuration: conf)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

public class ImmersiveReaderViewController: UIViewController, WKUIDelegate, WKNavigationDelegate {
    let tokenToSend: String
    let subdomainToSend: String
    let contentToSend: Content
    let optionsToSend: Options?
    let onSuccessImmersiveReader: (() -> Void)?
    let onFailureImmersiveReader: ((_ error: Error) -> Void)?
    let onTimeout: ((_ timeoutValue: TimeInterval) -> Void)?
    let onError: ((_ error: String) -> Void)?

    let startTime = Date().timeIntervalSince1970*1000
    var src: String
    var webView: WKWebView!
    var timer: Timer!
    var timeoutValue: TimeInterval!

    public init(tokenToPass: String, subdomainToPass: String, contentToPass: Content, optionsToPass: Options?, onSuccessImmersiveReader: @escaping () -> Void, onFailureImmersiveReader: @escaping (_ status: Error) -> Void, onTimeout: @escaping (_ timeoutValue: TimeInterval) -> Void, onError: @escaping (_ error: String) -> Void) {
        self.tokenToSend = tokenToPass
        self.subdomainToSend = subdomainToPass
        self.contentToSend = contentToPass
        self.optionsToSend = optionsToPass
        self.onSuccessImmersiveReader = onSuccessImmersiveReader
        self.onFailureImmersiveReader = onFailureImmersiveReader
        self.onTimeout = onTimeout
        self.onError = onError
        self.src = "https://" + subdomainToPass + ".cognitiveservices.azure.com/immersivereader/webapp/v1.0/reader"
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override public func viewDidLoad() {
        super.viewDidLoad()

        // If uiLang options are set update src to reflect this.
        switch optionsToSend?.uiLang {
        case .none: break
        case .some(let value):
            src = src + "?omkt=" + value
        }

        // Set timeout to default or value user specifies.
        switch optionsToSend?.timeout {
        case .none:
            timeoutValue = 15
        case .some(let value):
            timeoutValue = value
        }

        view.backgroundColor = .white
        webView = WKWebView()

        let contentController = WKUserContentController()
        if #available(iOS 11.0, *) {
            webView = ImmersiveReaderWebView(frame: .zero, contentController: contentController)
        } else {
            // Fallback on earlier versions
            webView = WKWebView()
            let config = WKWebViewConfiguration()
            config.userContentController = contentController
            webView = WKWebView(frame: .zero, configuration: config)
        }
        webView.navigationDelegate = self
        webView.uiDelegate = self

        contentController.add(self, name: "readyForContent")
        contentController.add(self, name: "launchSuccessful")
        contentController.add(self, name: "tokenExpired")
        contentController.add(self, name: "throttled")

        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false

        if #available(iOS 11.0, *) {
            let layoutGuide = view.safeAreaLayoutGuide
            webView.leadingAnchor.constraint(equalTo: layoutGuide.leadingAnchor).isActive = true
            webView.trailingAnchor.constraint(equalTo: layoutGuide.trailingAnchor).isActive = true
            webView.topAnchor.constraint(equalTo: layoutGuide.topAnchor).isActive = true
            webView.bottomAnchor.constraint(equalTo: layoutGuide.bottomAnchor).isActive = true

        } else {
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor).isActive = true
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor).isActive = true
            webView.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
        }
        // Get path to JavaScript file.
        guard let scriptPath = Bundle.main.path(forResource: "iFrameMessaging", ofType: "js") else {
            onError!("Could not create script path from resource.")
            return
        }
        do {
            let scriptSource = try String(contentsOfFile: scriptPath)
            let userScript = WKUserScript(source: scriptSource, injectionTime: .atDocumentStart, forMainFrameOnly: true)
            contentController.addUserScript(userScript)
        } catch {
            onError!("Could not parse JavaScript file.")
            return
        }

        // Start the timer.
        timer = Timer.scheduledTimer(timeInterval: timeoutValue, target: self, selector: #selector(self.timedOut), userInfo: nil, repeats: false)

        // Load the iframe from HTML.
        webView.loadHTMLString("<!DOCTYPE html><html style='width: 100%; height: 100%; margin: 0; padding: 0;'><head><meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'></head><body style='width: 100%; height: 100%; margin: 0; padding: 0;'><iframe id='immersiveReaderIframe' src = '\(src)' width='100%' height='100%' style='border: 0'></iframe></body></html>", baseURL: URL(string: "test://learningtools.onenote.com/learningtoolsapp/cognitive/reader"))
    }

    @objc func timedOut(_ timer: AnyObject) {
        onTimeout!(timeoutValue)
    }

    public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(.allow)
    }

    public func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void ) {
        decisionHandler(.allow)
    }
}

extension ImmersiveReaderViewController: WKScriptMessageHandler {
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "readyForContent" {
            // Stop the timer.
            timer.invalidate()

            // Create the message variable
            let message = Message(cogSvcsAccessToken: tokenToSend, cogSvcsSubdomain: subdomainToSend, resourceName: nil, request: contentToSend, launchToPostMessageSentDurationInMs: Int(Date().timeIntervalSince1970*1000 - startTime))
            do {
                let jsonData = try JSONEncoder().encode(message)
                let jsonString = String(data: jsonData, encoding: .utf8)
                self.webView.evaluateJavaScript("sendContentToReader(\(jsonString!))") { (result, error) in
                    if error != nil {
                        self.onError!("Error evaluating JavaScript \(String(describing: error))")
                    }
                }
            } catch { print(error)}
        }

        if message.name == "launchSuccessful" {
            onSuccessImmersiveReader!()
        }

        if message.name == "tokenExpired" {
            let tokenExpiredError = Error(code: "TokenExpired", message: "The access token supplied is expired.")
            onFailureImmersiveReader!(tokenExpiredError)
        }

        if message.name == "throttled" {
            let throttledError = Error(code: "Throttled", message: "You have exceeded the call rate limit.")
            onFailureImmersiveReader!(throttledError)
        }
    }
}
```

Add another new file to the project root folder named *LaunchImmersiveReader.swift* and add the following code.

```swift
import UIKit
import Foundation

var navigationController: UINavigationController?

public struct Content: Encodable {
    var title: String
    var chunks: [Chunk]

    public init(title: String, chunks: [Chunk]) {
        self.title = title
        self.chunks = chunks
    }
}

public struct Chunk: Encodable {
    var content: String
    var lang: String?
    var mimeType: String?

    public init(content: String, lang: String?, mimeType: String?) {
        self.content = content
        self.lang = lang
        self.mimeType = mimeType
    }
}

public struct Options {
    var uiLang: String?
    var timeout: TimeInterval?

    public init(uiLang: String?, timeout: TimeInterval?, uiZIndex: NSNumber?) {
        self.uiLang = uiLang
        self.timeout = timeout
    }
}

public struct Error {
    public var code: String
    public var message: String

    public init(code: String, message: String) {
        self.code = code
        self.message = message
    }
}

struct Message: Encodable {
    let cogSvcsAccessToken: String
    let cogSvcsSubdomain: String
    let resourceName: String?
    let request: Content
    let launchToPostMessageSentDurationInMs: Int

    init(cogSvcsAccessToken: String, cogSvcsSubdomain: String, resourceName: String?, request: Content, launchToPostMessageSentDurationInMs: Int) {
        self.cogSvcsAccessToken = cogSvcsAccessToken
        self.cogSvcsSubdomain = cogSvcsSubdomain
        self.resourceName = resourceName
        self.request = request
        self.launchToPostMessageSentDurationInMs = launchToPostMessageSentDurationInMs
    }
}

public func launchImmersiveReader(navController: UINavigationController, token: String, subdomain: String, content: Content, options: Options?, onSuccess: @escaping () -> Void, onFailure: @escaping (_ error: Error) -> Void) {
    if (content.chunks.count == 0) {
        let badArgumentError = Error(code: "BadArgument", message: "Chunks must not be empty.")
        onFailure(badArgumentError)
    }

    navigationController = navController
    let immersiveReaderViewController = ImmersiveReaderViewController(tokenToPass: token, subdomainToPass: subdomain, contentToPass: content, optionsToPass: options, onSuccessImmersiveReader: {
        onSuccess()
    }, onFailureImmersiveReader: { error in
        onFailure(error)
    }, onTimeout: { timeout in
        navigationController?.popViewController(animated: true)
        let timeoutError = Error(code: "Timeout", message: "Page failed to load after timeout \(timeout) ms.")
        onFailure(timeoutError)
    }, onError: { error in
        navigationController?.popViewController(animated: true)
        let errorMessage = Error(code: "Internal Error", message: error)
        onFailure(errorMessage)
    })
    navigationController!.pushViewController(immersiveReaderViewController, animated: true)
}
```

Add a file to the *Resources* folder named *iFrameMessaging.js* and add the following code.

```javascript
window.addEventListener("message", function(message) {
    if(message.data == "ImmersiveReader-ReadyForContent") {
        window.webkit.messageHandlers.readyForContent.postMessage(null);
    }

    if(message.data == "ImmersiveReader-LaunchSuccessful") {
        window.webkit.messageHandlers.launchSuccessful.postMessage(null);
    }

    if(message.data == "ImmersiveReader-TokenExpired") {
        window.webkit.messageHandlers.tokenExpired.postMessage(null);
    }

    if(message.data == "ImmersiveReader-Throttled") {
        window.webkit.messageHandlers.throttled.postMessage(null);
    }
});

function sendContentToReader(message) {
    document.getElementById('immersiveReaderIframe').contentWindow.postMessage(JSON.stringify({messageType:'Content', messageValue: message}), '*');
}
```

## Build and run the app

Set the archive scheme in Xcode by selecting a simulator or device target.

![Archive scheme - Swift](../../media/ios/xcode-archive-scheme.png)

![Select Target - Swift](../../media/ios/xcode-select-target.png)

In Xcode, press **Ctrl+R** or select the play button to run the project. The app should launch on the specified simulator or device.

In your app, you should see:

![Sample app - Swift](../../media/ios/sample-app-ipad.png)

When you select the **Immersive Reader** button, you'll see the Immersive Reader launched with the content on app.

![Immersive Reader - Swift](../../media/ios/immersive-reader-ipad.png)

## Next steps

> [!div class="nextstepaction"]
> [Create a resource and configure Microsoft Entra ID](../../how-to-create-immersive-reader.md)
