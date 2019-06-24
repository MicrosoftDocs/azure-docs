---
title: Push notifications to Swift iOS apps that use Azure Notification Hubs | Microsoft Docs
description: Learn how to push notifications to Swift iOS apps that use Azure Notification Hubs. 
services: notification-hubs
documentationcenter: ios
author: mikeparker104
manager: patniko
editor: spelluru

ms.assetid: 4e3772cf-20db-4b9f-bb74-886adfaaa65d
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: ios
ms.devlang: objective-c
ms.topic: article
ms.date: 05/21/2019
ms.author: miparker
---

# Tutorial: Push notifications to Swift iOS apps that use the Notification Hubs REST API

> [!div class="op_single_selector"]
> * [Objective-C](notification-hubs-ios-apple-push-notification-apns-get-started.md)
> * [Swift](notification-hubs-ios-push-notifications-swift-apps-get-started.md)

In this tutorial, you use Azure Notification Hubs to push notifications to a Swift-based iOS application by using the [REST API](/rest/api/notificationhubs/). You also create a blank iOS app that receives push notifications by using the [Apple Push Notification service (APNs)](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1).

This tutorial takes you through the following steps:

> [!div class="checklist"]
> * Generate the certificate signing request file.
> * Request your app for push notifications.
> * Create a provisioning profile for the app.
> * Create a notification hub.
> * Configure the notification hub with APNs information.
> * Connect your iOS app to a notification hub.
> * Test the solution.

## Prerequisites

To follow along, you need:

- To go through [Azure Notification Hubs overview](notification-hubs-push-notification-overview.md) if you aren't familiar with the service.
- To learn about [registrations and installation](notification-hubs-push-notification-registration-management.md).
- An active [Apple Developer Account](https://developer.apple.com).
- A Mac running Xcode along with a valid developer certificate installed into your Keychain.
- A physical iPhone device you can run and debug with, as you can't test push notifications with the simulator.
- Your physical iPhone device registered in the [Apple Portal](https://developer.apple.com) and associated with your certificate.
- An [Azure subscription](https://portal.azure.com) where you can create and manage resources.

Even if you have no prior experience with iOS development, you should be able to follow along the steps for creating this first-principles example. However, you'll benefit from familiarity with the following concepts:

- Building iOS apps with Xcode and Swift.
- Configuring an [Azure Notification hub](notification-hubs-ios-apple-push-notification-apns-get-started.md) for iOS.
- The [Apple Developer Portal](https://developer.apple.com) and the [Azure portal](https://portal.azure.com).

> [!NOTE]
> The notification hub will be configured to use the **Sandbox** authentication mode only. You should not use this authentication mode for production workloads.

[!INCLUDE [Notification Hubs Enable Apple Push Notifications](../../includes/notification-hubs-enable-apple-push-notifications.md)]

## Connect your iOS app to a notification hub

In this section, you'll build the iOS app that will connect to the notification hub.  

### Create an iOS project

1. In Xcode, create a new iOS project and select the **Single View Application** template.

1. When setting the options for the new project:

   1. Specify the **Product Name** (PushDemo) and **Organization Identifier** (`com.<organization>`) that you used when you set **Bundle Identifier** in the Apple Developer Portal.

   1. Choose the **Team** that the **App ID** was set up for.

   1. Set the **language** to **Swift**.

   1. Select **Next**.

1. Create a new folder called **SupportingFiles**.

1. Create a new p-list file called **devsettings.plist** in the **SupportingFiles** folder. Be sure to add this folder to your **gitignore** file so it isn't committed when working with a git repo. In a production app, you would likely be conditionally setting these secrets as part of an automated build process. Such settings aren't covered in this walkthrough.

1. Update **devsettings.plist** to include the following configuration entries by using your own values from the notification hub that you provisioned:

   | Key                            | Type                     | Value                     |
   |--------------------------------| -------------------------| --------------------------|
   | notificationHubKey             | String                   | \<hubKey>                  |
   | notificationHubKeyName         | String                   | \<hubKeyName>              |
   | notificationHubName            | String                   | \<hubName>                 |
   | notificationHubNamespace       | String                   | \<hubNamespace>            |

   You can find the required values by navigating to the notification hub resource in the Azure portal. In particular, the **notificationHubName** and **notificationHubNamespace** values are in the upper-right corner of the **Essentials** summary within the **Overview** page.

   ![Notification Hubs Essentials summary](./media/notification-hubs-ios-push-notifications-swift-apps-get-started/hub-essentials.png)

   You can also find the **notificationHubKeyName** and **notificationHubKey** values by navigating to **Access Policies** and selecting the respective **Access Policy**, such as `DefaultFullSharedAccessSignature`. After that, copy from the **Primary Connection String** the value prefixed with `SharedAccessKeyName=` for `notificationHubKeyName` and the value prefixed with `SharedAccessKey=` for the `notificationHubKey`.

   The connection string should be in the following format:

   ```xml
   Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<notificationHubKeyName>;SharedAccessKey=<notificationHubKey>
   ```

   To keep it simple, specify `DefaultFullSharedAccessSignature` so you can use the token to send notifications. In practice the `DefaultListenSharedAccessSignature` would be a better choice for situations where you only want to receive notifications.

1. Under **Project Navigator**, select the **Project Name** and then select the **General** tab.

1. Find **Identity** and then set the **Bundle Identifier** value so that it matches `com.<organization>.PushDemo`, which is the value used for the **App ID** from a previous step.

1. Find **Signing**, and then select the appropriate **Team** for your **Apple Developer Account**. The **Team** value should match the one under which you created your certificates and profiles.

1. Xcode should automatically pull down the appropriate **Provisioning Profile** value based on the **Bundle Identifier**. If you don't see the new **Provisioning Profile** value, try refreshing the profiles for the **Signing Identity** by selecting **Xcode** > **Preferences** > **Account** > **View Details**. Select **Signing Identity**, and then select the **Refresh** button in the bottom right to download the profiles.

1. Select the **Capabilities** tab and ensure that **push notifications** are enabled.

1. Open your **AppDelegate.swift** file to implement the **UNUserNotificationCenterDelegate** protocol and add the following code to the top of the class:

    ```swift
    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

        ...

        var configValues: NSDictionary?
        var notificationHubNamespace : String?
        var notificationHubName : String?
        var notificationHubKeyName : String?
        var notificationHubKey : String?
        let tags = ["12345"]
        let genericTemplate = PushTemplate(withBody: "{\"aps\":{\"alert\":\"$(message)\"}}")

        ...
    }
    ```

    You'll use these members later. Specifically, you'll use the **tags** and **genericTemplate** members as part of the registration. For more information on tags, see [Tags for registrations](notification-hubs-tags-segment-push-message.md) and [Template registrations](notification-hubs-templates-cross-platform-push-messages.md).

1. In the same file, add the following code to the **didFinishLaunchingWithOptions** function:

    ```swift
    if let path = Bundle.main.path(forResource: "devsettings", ofType: "plist") {
        if let configValues = NSDictionary(contentsOfFile: path) {
            self.notificationHubNamespace = configValues["notificationHubNamespace"] as? String
            self.notificationHubName = configValues["notificationHubName"] as? String
            self.notificationHubKeyName = configValues["notificationHubKeyName"] as? String
            self.notificationHubKey = configValues["notificationHubKey"] as? String
        }
    }

    if #available(iOS 10.0, *){
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) {
            (granted, error) in

            if (granted)
            {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
    }

    return true
    ```

    This code retrieves the setting values from **devsettings.plist**, sets the **AppDelegate** class as the **UNUserNotificationCenter** delegate, requests authorization for push notifications, and then calls **registerForRemoteNotifications**.

    To keep it simple, the code supports *iOS 10 and later only*. You can add support for previous OS versions by conditionally using the respective APIs and approaches as you would normally do.

1. In the same file, add the following functions:

    ```swift
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let installationId = (UIDevice.current.identifierForVendor?.description)!
        let pushChannel = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})
    }

    func showAlert(withText text : String) {
        let alertController = UIAlertController(title: "PushDemo", message: text, preferredStyle: UIAlertControllerStyle.alert)
        alertController.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default,handler: nil))
        self.window?.rootViewController?.present(alertController, animated: true, completion: nil)
    }
    ```

    The code uses the **installationId** and **pushChannel** values to register with the notification hub. In this case, you're using **UIDevice.current.identifierForVendor** to provide a unique value to identify the device and then formatting the **deviceToken** to provide the desired **pushChannel** value. The **showAlert** function exists simply to display some message text for demonstration purposes.

1. Still in the **AppDelegate.swift** file, add the **willPresent** and **didReceive** functions to **UNUserNotificationCenterDelegate**. These functions display an alert when they're notified that an app is running in either the foreground or the background respectively.

    ```swift
    @available(iOS 10.0, *)
    func userNotificationCenter(_ center: UNUserNotificationCenter, 
        willPresent notification: UNNotification, 
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        showAlert(withText: notification.request.content.body)
    }

    @available(iOS 10.0, *)
    func userNotificationCenter(_ center: UNUserNotificationCenter, 
        didReceive response: UNNotificationResponse, 
        withCompletionHandler completionHandler: @escaping () -> Void) {
        showAlert(withText: response.notification.request.content.body)
    }
    ```

1. Add print statements to the bottom of the **didRegisterForRemoteNotificationsWithDeviceToken** function to verify that **installationId** and **pushChannel** are being assigned values.

1. Create the **Models**, **Services**, and **Utilities** folders for the foundational components you'll be adding to the project later.

1. Check that the project builds and runs on a physical device. Push notifications can't be tested by using the simulator.

### Create models

In this step, you'll create a set of models to represent the [Notification Hubs REST API](/rest/api/notificationhubs/) payloads and to store the required shared access signature (SAS) token data.

1. Add a new Swift file called **PushTemplate.swift** to the **Models** folder. This model provides a struct representing the **BODY** of an individual template as part of the **DeviceInstallation** payload.

    ```swift
    import Foundation

    struct PushTemplate : Codable {
        let body : String

        init(withBody body : String) {
            self.body = body
        }
    }
    ```

1. Add a new Swift file called **DeviceInstallation.swift** to the **Models** folder. This file defines a struct representing the payload for creating or updating a **Device Installation**. Add the following code to the file:

    ```swift
    import Foundation

    struct DeviceInstallation : Codable {
        let installationId : String
        let pushChannel : String
        let platform : String = "apns"
        var tags : [String]
        var templates : Dictionary<String, PushTemplate>

        init(withInstallationId installationId : String, andPushChannel pushChannel : String) {
            self.installationId = installationId
            self.pushChannel = pushChannel
            self.tags = [String]()
            self.templates = Dictionary<String, PushTemplate>()
        }
    }
    ```

1. Add a new Swift file called **TokenData.swift** to the **Models** folder. This model will be used to store a SAS token along with its expiration.

    ```swift
    import Foundation

    struct TokenData {

        let token : String
        let expiration : Int

        init(withToken token : String, andTokenExpiration expiration : Int) {
            self.token = token
            self.expiration = expiration
        }
    }
    ```

### Generate a SAS token

Notification Hubs use the same security infrastructure as Azure Service Bus. To call the REST API, you'll need to [programmatically generate a SAS token](/rest/api/eventhub/generate-sas-token) that can be used in the **Authorization** header of the request.  

The resulting token will be in the following format:

```xml
SharedAccessSignature sig=<UrlEncodedSignature>&se=<ExpiryEpoch>&skn=<KeyName>&sr=<UrlEncodedResourceUri>
```

The process itself involves the same six key steps:  

1. Computing the expiry in [UNIX Epoch time](https://en.wikipedia.org/wiki/Unix_time) format, which means the number of seconds elapsed since midnight Coordinated Universal Time, January 1, 1970.
1. Formatting the **ResourceUrl** that represents the resource you're trying to access so it's percent-encoded and lowercase. The **ResourceUrl** has the form `'https://<namespace>.servicebus.windows.net/<hubName>'`.
1. Preparing the **StringToSign**, which is formatted as `'<UrlEncodedResourceUrl>\n<ExpiryEpoch>'`.
1. Computing and Base64-encoding the **Signature** by using the HMAC-SHA256 hash of the **StringToSign** value. The hash value is used with the **Key** part of the **Connection String** for the respective **Authorization Rule**.
1. Formatting the Base64 encoded **Signature** so it's percent encoded.
1. Constructing the token in the expected format by using the **UrlEncodedSignature**, **ExpiryEpoch**, **KeyName**, and **UrlEncodedResourceUrl** values.

See the [Azure Service Bus documentation](../service-bus-messaging/service-bus-sas.md) for a more thorough overview of shared access signature and how Azure Service Bus and Notification Hubs use it.

For the purposes of this Swift example, you're going to use Apple's open-source **CommonCrypto** library to help with the hashing of the signature. As it's a C library, it isn't accessible in Swift out of the box. You can make the library available by using a bridging header.

To add and configure the bridging header:

1. In Xcode, select **File** > **New** > **File** > **Header File**. Name the header file **BridgingHeader.h**.

1. Edit the file to import **CommonHMAC.h**:

    ```swift
    #import <CommonCrypto/CommonHMAC.h>

    #ifndef BridgingHeader_h
    #define BridgingHeader_h


    #endif /* BridgingHeader_h */
    ```

1. Update the Target’s **Build Settings** to reference the bridging header:

   1. Open the **Building Settings** tab and scroll down to the **Swift Compiler** section.

   1. Ensure that the **Install Objective-C Compatibility Header** option is set to **Yes**.

   1. Enter the file path `'<ProjectName>/BridgingHeader.h'` into the **Objective-C bridging Header** option. This is the file path to our bridging header.

   If you can't find these options, ensure that you have the **All** view selected rather than **Basic** or **Customized**.

   There are many third-party open-source wrapper libraries available that might make using **CommonCrypto** a bit easier. However, discussion of such libraries is beyond the scope of this article.

1. Add a new Swift file named **TokenUtility.swift** within the **Utilities** folder and add the following code:

   ```swift
   import Foundation

   struct TokenUtility {    
        typealias Context = UnsafeMutablePointer<CCHmacContext>

        static func getSasToken(forResourceUrl resourceUrl : String, withKeyName keyName : String, andKey key : String, andExpiryInSeconds expiryInSeconds : Int = 3600) -> TokenData {
            let expiry = (Int(NSDate().timeIntervalSince1970) + expiryInSeconds).description
            let encodedUrl = urlEncodedString(withString: resourceUrl)
            let stringToSign = "\(encodedUrl)\n\(expiry)"
            let hashValue = sha256HMac(withData: stringToSign.data(using: .utf8)!, andKey: key.data(using: .utf8)!)
            let signature = hashValue.base64EncodedString(options: .init(rawValue: 0))
            let encodedSignature = urlEncodedString(withString: signature)
            let sasToken = "SharedAccessSignature sr=\(encodedUrl)&sig=\(encodedSignature)&se=\(expiry)&skn=\(keyName)"
            let tokenData = TokenData(withToken: sasToken, andTokenExpiration: expiryInSeconds)

            return tokenData
        }

        private static func sha256HMac(withData data : Data, andKey key : Data) -> Data {
            let context = Context.allocate(capacity: 1)
            CCHmacInit(context, CCHmacAlgorithm(kCCHmacAlgSHA256), (key as NSData).bytes, size_t((key as NSData).length))
            CCHmacUpdate(context, (data as NSData).bytes, (data as NSData).length)
            var hmac = Array<UInt8>(repeating: 0, count: Int(CC_SHA256_DIGEST_LENGTH))
            CCHmacFinal(context, &hmac)

            let result = NSData(bytes: hmac, length: hmac.count)
            context.deallocate()

            return result as Data
        }

        private static func urlEncodedString(withString stringToConvert : String) -> String {
            var encodedString = ""
            let sourceUtf8 = (stringToConvert as NSString).utf8String
            let length = strlen(sourceUtf8)

            let charArray: [Character] = [ ".", "-", "_", "~", "a", "z", "A", "Z", "0", "9"]
            let asUInt8Array = String(charArray).utf8.map{ Int8($0) }

            for i in 0..<length {
                let currentChar = sourceUtf8![i]

                if (currentChar == asUInt8Array[0] || currentChar == asUInt8Array[1] || currentChar == asUInt8Array[2] || currentChar == asUInt8Array[3] ||
                    (currentChar >= asUInt8Array[4] && currentChar <= asUInt8Array[5]) ||
                    (currentChar >= asUInt8Array[6] && currentChar <= asUInt8Array[7]) ||
                    (currentChar >= asUInt8Array[8] && currentChar <= asUInt8Array[9])) {
                    encodedString += String(format:"%c", currentChar)
                }
                else {
                    encodedString += String(format:"%%%02x", currentChar)
                }
            }

            return encodedString
        }
    }
   ```

   This utility encapsulates the logic responsible for generating the SAS token.

   As outlined previously, the **getSasToken** function orchestrates the high-level steps required to prepare the token. The function will be called by the installation service later in this tutorial.

   The other two functions are called by the **getSasToken** function: **sha256HMac** for computing the signature and **urlEncodedString** for encoding the associated URL string. The **urlEncodedString** function is required as it isn't possible to achieve the required output by using the built-in **addingPercentEncoding** function.

   The [Azure Storage iOS SDK](https://github.com/Azure/azure-storage-ios/blob/master/Lib/Azure%20Storage%20Client%20Library/Azure%20Storage%20Client%20Library/AZSUtil.m) is an excellent example of how to approach these operations in Objective-C. Further information on Azure Service Bus SAS tokens can be found in the [Azure Service Bus documentation](../service-bus-messaging/service-bus-sas.md).

### Verify the SAS token

Before you implement the installation service in the client, check that our app is correctly generating the SAS token by using your HTTP utility of choice. For the purposes of this tutorial, our tool of choice will be **Postman**.

Use an appropriately placed print statement or breakpoint to note the **installationId** and the **token** values being generated by the app.

Follow these steps to call the **installations** API:

1. In **Postman**, open a new tab.

1. Set the request to **GET** and specify the following address:

    ```xml
    https://<namespace>.servicebus.windows.net/<hubName>/installations/<installationId>?api-version=2015-01
    ```

1. Configure the request headers as follows:

   | Key           | Value            |
   | ------------- | ---------------- |
   | Content-Type  | application/json |
   | Authorization | \<sasToken>       |
   | x-ms-version  | 2015-01          |

1. Select the **Code** button that appears on the upper-right under the **Save** button. The request should look similar to the following example:

    ```html
    GET /<hubName>/installations/<installationId>?api-version=2015-01 HTTP/1.1
    Host: <namespace>.servicebus.windows.net
    Content-Type: application/json
    Authorization: <sasToken>
    x-ms-version: 2015-01
    Cache-Control: no-cache
    Postman-Token: <postmanToken>
    ```

1. Select the **Send** button.

No registration exists for the specified **installationId** at this point. The verification should result in a "404 Not Found" response rather than a "401 Unauthorized" response. This result should confirm that the SAS token has been accepted.

### Implement the installation service class

Next you'll implement our basic wrapper around the [Installations REST API](/rest/api/notificationhubs/create-overwrite-installation).  

Add a new Swift file called **NotificationRegistrationService.swift** under the **Services** folder, and then add the following code to this file:

```swift
import Foundation

class NotificationRegistrationService {
    private let tokenizedBaseAddress: String = "https://%@.servicebus.windows.net/%@"
    private let tokenizedCreateOrUpdateInstallationRequest = "/installations/%@?api-version=%@"
    private let session = URLSession(configuration: URLSessionConfiguration.default)
    private let apiVersion = "2015-01"
    private let jsonEncoder = JSONEncoder()
    private let defaultHeaders: [String : String]
    private let installationId : String
    private let pushChannel : String
    private let hubNamespace : String
    private let hubName : String
    private let keyName : String
    private let key : String
    private var tokenData : TokenData? = nil

    init(withInstallationId installationId : String,
            andPushChannel pushChannel : String,
            andHubNamespace hubNamespace : String,
            andHubName hubName : String,
            andKeyName keyName : String,
            andKey key: String) {
        self.installationId = installationId
        self.pushChannel = pushChannel
        self.hubNamespace = hubNamespace
        self.hubName = hubName
        self.keyName = keyName
        self.key = key
        self.defaultHeaders = ["Content-Type": "application/json", "x-ms-version": apiVersion]
    }

    func register(
        withTags tags : [String]? = nil,
        andTemplates templates : Dictionary<String, PushTemplate>? = nil,
        completeWith completion: ((_ result: Bool) -> ())? = nil) {

        var deviceInstallation = DeviceInstallation(withInstallationId: installationId, andPushChannel: pushChannel)

        if let tags = tags {
            deviceInstallation.tags = tags
        }

        if let templates = templates {
            deviceInstallation.templates = templates
        }

        if let deviceInstallationJson = encodeToJson(deviceInstallation) {
            let sasToken = getSasToken()
            let requestUrl = String.init(format: tokenizedCreateOrUpdateInstallationRequest, installationId, apiVersion)
            let apiEndpoint = "\(getBaseAddress())\(requestUrl)"

            var request = URLRequest(url: URL(string: apiEndpoint)!)
            request.httpMethod = "PUT"

            for (key,value) in self.defaultHeaders {
                request.addValue(value, forHTTPHeaderField: key)
            }

            request.addValue(sasToken, forHTTPHeaderField: "Authorization")
            request.httpBody = Data(deviceInstallationJson.utf8)

            (self.session.dataTask(with: request) { dat, res, err in
                if let completion = completion {
                        completion(err == nil && (res as! HTTPURLResponse).statusCode == 200)
                }
            }).resume()
        }
    }

    private func getBaseAddress() -> String {
        return String.init(format: tokenizedBaseAddress, hubNamespace, hubName)
    }

    private func getSasToken() -> String {
        if (tokenData == nil ||
            Date(timeIntervalSince1970: Double((tokenData?.expiration)!)) < Date(timeIntervalSinceNow: -(5 * 60))) {
            self.tokenData = TokenUtility.getSasToken(forResourceUrl: getBaseAddress(), withKeyName: self.keyName, andKey: self.key)
        }

        return (tokenData?.token)!
    }

    private func encodeToJson<T : Encodable>(_ object: T) -> String? {
        do {
            let jsonData = try jsonEncoder.encode(object)
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                return jsonString
            } else {
                return nil
            }
        }
        catch {
            return nil
        }
    }
}
```

The requisite details are provided as part of initialization. Tags and templates are optionally passed into the **register** function to form part of the **Device Installation** JSON payload.  

The **register** function calls the other private functions to prepare the request. After a response is received, the completion is called and indicates whether the registration was successful.  

The request endpoint is constructed by the **getBaseAddress** function. The construction uses the notification hub parameters *namespace* and *name* that were provided during initialization.  

The **getSasToken** function checks whether the currently stored token is valid. If the token isn't valid, the function calls **TokenUtility** to generate a new token and then stores it before returning a value.

Finally, **encodeToJson** converts the respective model objects into JSON for use as part of the request body.

### Invoke the Notification Hubs REST API

The last step is updating **AppDelegate** to use **NotificationRegistrationService** to register with our **NotificationHub**.

1. Open **AppDelegate.swift** and add a class-level variable to store a reference to the **NotificationRegistrationService**:

    ```swift
    var registrationService : NotificationRegistrationService?
    ```

1. In the same file, update the **didRegisterForRemoteNotificationsWithDeviceToken** function to initialize the **NotificationRegistrationService** with the requisite parameters, and then call the **register** function.

    ```swift
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let installationId = (UIDevice.current.identifierForVendor?.description)!
        let pushChannel = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})

        // Initialize the Notification Registration Service
        self.registrationService = NotificationRegistrationService(
            withInstallationId: installationId,
            andPushChannel: pushChannel,
            andHubNamespace: notificationHubNamespace!,
            andHubName: notificationHubName!,
            andKeyName: notificationHubKeyName!,
            andKey: notificationHubKey!)

        // Call register, passing in the tags and template parameters
        self.registrationService!.register(withTags: tags, andTemplates: ["genericTemplate" : self.genericTemplate]) { (result) in
            if !result {
                print("Registration issue")
            } else {
                print("Registered")
            }
        }
    }
    ```

    To keep it simple, you're going to use a couple of print statements to update the output window with the result of the **register** operation.

1. Now build and run the app on a physical device. You should see "Registered" in the output window.

## Test the solution

Our app at this stage is registered with **NotificationHub** and can receive push notifications. In Xcode, stop the debugger and close the app if it's currently running. Next, check that the **Device Installation** details are as expected and that our app can now receive push notifications.  

### Verify the device installation

You can now make the same request as you did previously by using **Postman** for [verifying the SAS token](#verify-the-sas-token). Assuming that the SAS token hasn't expired, the response should now include the installation details you provided, such as the templates and tags.

```json
{
    "installationId": "<installationId>",
    "pushChannel": "<pushChannel>",
    "pushChannelExpired": false,
    "platform": "apns",
    "expirationTime": "9999-12-31T23:59:59.9999999Z",
    "tags": [
        "12345"
    ],
    "templates": {
        "genericTemplate": {
            "body": "{\"aps\":{\"alert\":\"$(message)\"}}",
            "tags": [
                "genericTemplate"
            ]
        }
    }
}
```

### Send a test notification (Azure portal)

The quickest way to test that you can now receive notifications is to browse to the notification hub in the Azure portal:

1. In the Azure portal, browse to the **Overview** tab on your notification hub.

1. Select **Test Send**, which is above the **Essentials** summary in the upper-left of the portal window:

    ![Notification Hubs Essentials Summary Test Send Button](./media/notification-hubs-ios-push-notifications-swift-apps-get-started/hub-essentials-test-send.png)

1. Choose **Custom Template** from the **Platforms** list.

1. Enter **12345** for the **Send to Tag Expression**. You had previously specified this tag in our installation.

1. Optionally edit the **message** in the JSON payload:

    ![Notification Hubs Test Send](./media/notification-hubs-ios-push-notifications-swift-apps-get-started/hub-test-send.png)

1. Select **Send**. The portal should indicate whether the notification was successfully sent to the device:

    ![Notification Hubs Test Send Results](./media/notification-hubs-ios-push-notifications-swift-apps-get-started/hub-test-send-result.png)

    Assuming that the app isn't running in the foreground, you should also see a notification in the **Notification Center** on your device. Tapping the notification should open the app and show the alert.

    ![Notification Received Example](./media/notification-hubs-ios-push-notifications-swift-apps-get-started/test-send-notification-received.png)

### Send a test notification (Mail carrier)

You can send notifications via the [REST API](/rest/api/notificationhubs/) by using **Postman**, which may be a more convenient way to test.

1. Open a new tab in **Postman**.

1. Set the request to **POST**, and enter the following address:

    ```xml
    https://<namespace>.servicebus.windows.net/<hubName>/messages/?api-version=2015-01
    ```

1. Configure the request headers as follows:

   | Key                            | Value                          |
   | ------------------------------ | ------------------------------ |
   | Content-Type                   | application/json;charset=utf-8 |
   | Authorization                  | \<sasToken>                     |
   | ServiceBusNotification-Format  | template                       |
   | Tags                           | "12345"                        |

1. Configure the request **BODY** to use **RAW - JSON (application.json)** with the following JSON payload:

    ```json
    {
       "message" : "Hello from Postman!"
    }
    ```

1. Select the **Code** button, which is under the **Save** button on the upper-right of the window. The request should look similar to the following example:

    ```html
    POST /<hubName>/messages/?api-version=2015-01 HTTP/1.1
    Host: <namespace>.servicebus.windows.net
    Content-Type: application/json;charset=utf-8.
    ServiceBusNotification-Format: template
    Tags: "12345"
    Authorization: <sasToken>
    Cache-Control: no-cache
    Postman-Token: <postmanToken>

    {
        "message" : "Hello from Postman!"
    }
    ```

1. Select the **Send** button.

You should get a success status code and receive the notification on the client device.

## Next steps
You now have a basic iOS Swift app connected to a notification hub via the [REST API](/rest/api/notificationhubs/) and can send and receive notifications. For more information, see the following articles:

- [Azure Notification Hubs overview](notification-hubs-push-notification-overview.md)
- [Notification Hubs REST APIs](/rest/api/notificationhubs/)
- [Notification Hubs SDK for back-end operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/)
- [Notification Hubs SDK on GitHub](https://github.com/Azure/azure-notificationhubs)
- [Register with application back end](notification-hubs-ios-aspnet-register-user-from-backend-to-push-notification.md)
- [Registration management](notification-hubs-push-notification-registration-management.md)
- [Working with tags](notification-hubs-tags-segment-push-message.md) 
- [Working with custom templates](notification-hubs-templates-cross-platform-push-messages.md)
- [Service Bus access control with shared access signatures](../service-bus-messaging/service-bus-sas.md)
- [Programmatically generate SAS tokens](/rest/api/eventhub/generate-sas-token)
- [Apple security: common crypto](https://developer.apple.com/security/)
- [UNIX Epoch time](https://en.wikipedia.org/wiki/Unix_time)
- [HMAC](https://en.wikipedia.org/wiki/HMAC)
