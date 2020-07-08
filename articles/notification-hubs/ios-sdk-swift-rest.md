---

title: Send push notifications to Swift iOS apps using Azure Notification Hubs and the REST APIs
description: In this tutorial, you learn how to use Azure Notification Hubs and the REST APIs to send push notifications to iOS devices.
author: sethmanheim
ms.author: sethm
ms.date: 06/19/2020
ms.topic: tutorial
ms.service: notification-hubs
ms.reviewer: thsomasu
ms.lastreviewed: 06/03/2020
---

# Tutorial: Send push notifications to Swift iOS apps using Notification Hubs REST APIs

This tutorial describes how to use Azure Notification Hubs to send push notifications to an iOS application using REST APIs.

This tutorial covers the following steps:

- Create a sample iOS app.
- Connect your iOS app to Azure Notification Hubs.
- Send test push notifications.
- Verify that your app receives notifications.

The complete code for this tutorial can be downloaded from [GitHub](https://github.com/Azure/azure-notificationhubs-ios/tree/v3-preview2/Samples).

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- A Mac running [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along with a valid developer certificate installed into your Keychain.

- An iPhone or iPad running iOS version 10 or later.

- Your physical device registered in the [Apple Portal](https://developer.apple.com/) and associated with your certificate.

Before you proceed, be sure to go through the previous tutorial on getting started with [Azure Notification Hubs for iOS apps](https://go.microsoft.com/fwlink/?linkid=2129801) to set up and configure push credentials in your notification hub. Even if you have no prior experience with iOS development, you should be able to follow these steps.

> [!NOTE]
> Because of configuration requirements for push notifications, you must deploy and test push notifications on a physical iOS device (iPhone or iPad), instead of the iOS emulator.

In the following sections, you build an iOS app that connects to the notification hub.

## Create an iOS project

1. In Xcode, create a new iOS project and select the **Single View Application** template.

2. When setting the options for the new project:
   - Specify the **Product Name** (PushDemo) and **Organization Identifier** (`com.<organization>`) that you used when you set the **Bundle Identifier** in the Apple Developer Portal.
   - Choose the **Team** for which the **App ID** was set up.
   - Set the **language** to **Swift**.
   - Select **Next**.

3. Create a new folder called **SupportingFiles**.

4. Create a new p-list file called **devsettings.plist** in the **SupportingFiles** folder. Be sure to add this folder to your **gitignore** file so it isn't committed when working with a git repo. In a production app, you might be conditionally setting these secrets as part of an automated build process. These settings are not covered in this tutorial.

5. Update **devsettings.plist** to include the following configuration entries by using your own values from the notification hub that you provisioned:

   | **Key**                  | **Type** | **Value**        |
   | ------------------------ | -------- | ---------------- |
   | notificationHubKey       | String   | `<hubKey>`       |
   | notificationHubKeyName   | String   | `<hubKeyName>`   |
   | notificationHubName      | String   | `<hubName>`      |
   | notificationHubNamespace | String   | `<hubNamespace>` |

   You can find the required values by navigating to the notification hub resource in the Azure portal. In particular, the **notificationHubName** and **notificationHubNamespace** values are in the upper-right corner of the **Essentials** summary within the **Overview** page.

   :::image type="content" source="media/ios-sdk-swift-rest/image1.png" alt-text="Required values":::

   You can also find the **notificationHubKeyName** and **notificationHubKey** values by navigating to **Access Policies** and selecting the respective **Access Policy**, such as **DefaultFullSharedAccessSignature**. After that, copy from the **Primary Connection String** the value prefixed with `SharedAccessKeyName=` for **notificationHubKeyName**, and the value prefixed with `SharedAccessKey=` for the **notificationHubKey**. The connection string should be in the following format:

   ```xml
   Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<notificationHubKeyName>;SharedAccessKey=<notificationHubKey>
   ```

   For simplicity, specify **DefaultFullSharedAccessSignature**, so that you can use the token to send notifications. In practice, the **DefaultListenSharedAccessSignature** is a better choice for situations in which you only want to receive notifications.

6. Under **Project Navigator**, select the **Project Name** and then select the **General** tab.

7. Find **Identity** and then set the **Bundle Identifier** value so that it matches `com.<organization>.PushDemo`, which is the value used for the **App ID** from a previous step.

8. Find **Signing & Capabilities**, and then select the appropriate **Team** for your **Apple Developer Account**. The **Team** value should match the one under which you created your certificates and profiles.

9. Xcode should automatically download the appropriate **Provisioning Profile** value based on the **Bundle Identifier**. If you don't see the new **Provisioning Profile** value, try refreshing the profiles for the **Signing Identity** by selecting **Xcode**, then **Preferences**, **Account**, and then select the **Download Manual Profiles** button to download the profiles.

10. Still on the **Signing & Capabilities** tab, click the **+ Capability** button and double tap on **Push Notifications** from the list to ensure **Push Notifications** are enabled.

11. Open your **AppDelegate.swift** file to implement the **UNUserNotificationCenterDelegate** protocol and add the following code to the top of the class:

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

       ...

    }
    ```

    You'll use these members later. Specifically, you'll use the **tags** member as part of the registration using a **custom template**. For more information on tags, see [Tags for registrations](notification-hubs-tags-segment-push-message.md) and [Template registrations](notification-hubs-templates-cross-platform-push-messages.md).

12. In the same file, add the following code to the **didFinishLaunchingWithOptions** function:

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

    This code retrieves the settings from **devsettings.plist**, sets the **AppDelegate** class as the **UNUserNotificationCenter** delegate, requests authorization for push notifications, and then calls **registerForRemoteNotifications**.

    For simplicity, the code only supports iOS 10 and later. You can add support for previous iOS versions by conditionally using the respective APIs and approaches, as you would normally do.

13. In the same file, add the following code:

    ```swift
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let installationId = (UIDevice.current.identifierForVendor?.description)!
        let pushChannel = deviceToken.reduce("", {$0 + String(format: "%02X", $1)})
    }

    func showAlert(withText text : String) {
        let alertController = UIAlertController(title: "PushDemo", message: text, preferredStyle: UIAlertControllerStyle.alert)
        alertController.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.default,handler: nil))
        let keyWindow = UIApplication.shared.windows.filter {$0.isKeyWindow}.first
        keyWindow?.rootViewController?.present(alertController, animated: true, completion: nil)
    }
    ```

    This code uses the **installationId** and **pushChannel** values to register with the notification hub. In this case, you're using **UIDevice.current.identifierForVendor** to provide a unique value to identify the device and then formatting the **deviceToken** to provide the desired **pushChannel** value. The **showAlert** function exists simply to display some message text for demonstration purposes.

14. Still in the **AppDelegate.swift** file, add the **willPresent** and **didReceive** functions to **UNUserNotificationCenterDelegate**. These functions display an alert when they're notified that an app is running in either the foreground or the background.

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

15. Add `print` statements to the bottom of the **didRegisterForRemoteNotificationsWithDeviceToken** function to verify that **installationId** and **pushChannel** are being assigned values:

    ```swift
    print(installationId)
    print(pushChannel)
    ```

16. Create the **Models**, **Services**, and **Utilities** folders for the foundational components you'll be adding to the project later.

17. Check that the project builds and runs on a physical device. Push notifications cannot be tested by using the simulator.

## Create models

In this step, you create a set of models to represent the [Notification Hubs REST API](/rest/api/notificationhubs/) payloads, and to store the required shared access signature (SAS) token data.

1. Add a new Swift file called **PushTemplate.swift** to the **Models** folder. This model defines a structure that represents the **BODY** of an individual template as part of the **DeviceInstallation** payload.

    ```swift
    import Foundation

    struct PushTemplate : Codable {
        let body : String

        init(withBody body : String) {
            self.body = body
        }
    }
    ```

2. Add a new Swift file called **DeviceInstallation.swift** to the **Models** folder. This file defines a structure that represents the payload for creating or updating a **Device Installation**. Add the following code to the file:

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

3. Add a new Swift file called **TokenData.swift** to the **Models** folder. This model is used to store a SAS token along with its expiration. Add the following code to the file:

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

## Generate a SAS token

Notification Hubs uses the same security infrastructure as Azure Service Bus. To call the REST API, [programmatically generate a SAS token](/rest/api/eventhub/generate-sas-token) that can be used in the **Authorization** header of the request.

The resulting token will be in the following format:

```xml
SharedAccessSignature sig=\<UrlEncodedSignature\>\&se=\<ExpiryEpoch\>\&skn=\<KeyName\>\&sr=\<UrlEncodedResourceUri\> |
```

The process itself involves the same six steps:

1. Compute the expiry in [UNIX Epoch time](https://en.wikipedia.org/wiki/Unix_time) format, which means the number of seconds elapsed since midnight Universal  Coordinated Time, January 1, 1970.

2. Format the **ResourceUrl** that represents the resource you're trying to access so it's percent-encoded and lowercase. The **ResourceUrl** has the format `https://<namespace>.servicebus.windows.net/<hubName>`.

3. Prepare the **StringToSign**, which is formatted as `<UrlEncodedResourceUrl>\n<ExpiryEpoch>`.

4. Compute and Base64-encode the **Signature** by using the HMAC-SHA256 hash of the **StringToSign** value. The hash value is used with the **Key** part of the **Connection String** for the respective **Authorization Rule**.

5. Format the Base64-encoded **Signature** so it's percent encoded.

6. Construct the token in the expected format by using the **UrlEncodedSignature**, **ExpiryEpoch**, **KeyName**, and **UrlEncodedResourceUrl** values.

See the [Azure Service Bus documentation](../service-bus-messaging/service-bus-sas.md) for a more complete overview of shared access signatures, and how Azure
Service Bus and Notification Hubs use it.

For the purposes of this Swift example, you use the Apple open-source **CommonCrypto** library to help with the hashing of the signature. As it's a C library, it is not accessible in Swift out of the box. You can make the library available by using a bridging header.

To add and configure the bridging header:

1. In Xcode, select **File**, then **New**, then **File**, and then select **Header File**. Name the header file **BridgingHeader.h**.

2. Edit the file to import **CommonHMAC.h**:

   ```swift
   #import <CommonCrypto/CommonHMAC.h>

   #ifndef BridgingHeader_h
   #define BridgingHeader_h

   #endif /* BridgingHeader_h */
   ```

3. Update the target **Build Settings** to reference the bridging header:

   1. Select the **PushDemo** project and scroll down to the **Swift Compiler** section.

   2. Ensure that the **Install Objective-C Compatibility Header** option is set to **Yes**.

   3. Enter the file path `<ProjectName>/BridgingHeader.h` in the **Objective-C bridging Header** option. This is the file path to the bridging header.

   If you can't find these options, ensure that you have the **All** view selected, rather than **Basic** or **Customized**.

   There are many third-party open-source wrapper libraries available that might make using **CommonCrypto** a bit easier. However, discussion of these libraries is beyond the scope of this article.

4. Add a new Swift file named **TokenUtility.swift** within the **Utilities** folder, and add the following code:

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

   As outlined previously, the **getSasToken** function orchestrates the high-level steps required to prepare the token. The function will be called by the installation service later in this tutorial.

   The other two functions are called by the **getSasToken** function: **sha256HMac** for computing the signature, and **urlEncodedString** for encoding the associated URL string. The **urlEncodedString** function is required, as it is not possible to achieve the required output by using the built-in **addingPercentEncoding** function.

   The [Azure Storage iOS SDK](https://github.com/Azure/azure-storage-ios/blob/master/Lib/Azure%20Storage%20Client%20Library/Azure%20Storage%20Client%20Library/AZSUtil.m) is an excellent example of how to approach these operations in Objective-C. Further information on Azure Service Bus SAS tokens can be found in the [Azure Service Bus documentation](../service-bus-messaging/service-bus-sas.md).

5. In **AppDelegate.swift**, add the following code to the `didRegisterForRemoteNotificationsWithDeviceToken` function to verify that the **TokenUtility.getSasToken** is generating a valid token

   ```swift
   let baseAddress = "https://<notificaitonHubNamespace>.servicebus.windows.net/<notifiationHubName>"

   let tokenData = TokenUtility.getSasToken(forResourceUrl: baseAddress,
                                            withKeyName: self.notificationHubKeyName!,
                                            andKey: self.notificationHubKey!)

   print(tokenData.token)
   ```

   Be sure to replace the placeholders in the **baseAddress** string with your own  values.

## Verify the SAS token

Before you implement the installation service in the client, check that your app is correctly generating the SAS token by using an HTTP utility. For the purposes of this tutorial, our tool of choice is **Postman**.

Make a note of the **installationId** and **token** values generated by the app.

Follow these steps to call the **installations** API:

1. In **Postman**, open a new tab.
2. Set the request to **GET** and specify the following address:

   ```xml
   https://<namespace>.servicebus.windows.net/<hubName>/installations/<installationId>?api-version=2015-01
   ```

3. Configure the request headers as follows:

   | **Key**       | **Value**        |
   | ------------- | ---------------- |
   | Content-Type  | application/json |
   | Authorization | \<sasToken\>     |
   | x-ms-version  | 2015-01          |

4. Select the **Code** button that appears on the upper-right under the **Save** button. The request should look similar to the following example:

   ```xml
   GET /<hubName>/installations/<installationId>?api-version=2015-01 HTTP/1.1
   Host: <namespace>.servicebus.windows.net
   Content-Type: application/json
   Authorization: <sasToken>
   x-ms-version: 2015-01
   Cache-Control: no-cache
   Postman-Token: <postmanToken>
   ```

5. Select the **Send** button.

No registration exists for the specified **installationId** at this point. The verification should result in a "404 Not Found" response rather than a "401 Unauthorized" response. This result should confirm that the SAS token has been accepted.

## Implement the installation service class

Next, implement a basic wrapper around the [Installations REST API](/rest/api/notificationhubs/create-overwrite-installation).

Add a new Swift file named **NotificationRegistrationService.swift** under
the **Services** folder, and then add the following code to this file:

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
    private var tokenExpiryDate : Date? = nil

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
                        completion(err == nil &&
                        (res as! HTTPURLResponse).statusCode == 200)
                }
            }).resume()
        }
    }

    private func getBaseAddress() -> String {
        return String.init(format: tokenizedBaseAddress, hubNamespace, hubName)
    }

    private func getSasToken() -> String {
        if (tokenData == nil ||
            tokenExpiryDate == nil ||
            Date() >= tokenExpiryDate!) {

            self.tokenData = TokenUtility.getSasToken(
                forResourceUrl: getBaseAddress(),
                withKeyName: self.keyName,
                andKey: self.key)

            self.tokenExpiryDate = Date(timeIntervalSinceNow: -(5 * 60))
                .addingTimeInterval(TimeInterval(tokenData!.expiration))
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

The requisite details are provided as part of initialization. Tags and templates are optionally passed into the **register** function to form part of the **Device Installation** JSON payload.

The **register** function calls the other private functions to prepare the request. After a response is received, the completion is called and indicates whether the registration was successful.

The request endpoint is constructed by the **getBaseAddress** function. The construction uses the notification hub parameters *namespace* and *name* that were provided during initialization.

The **getSasToken** function checks whether the currently stored token is valid. If the token isn't valid, the function calls **TokenUtility** to generate a new token and then stores it before returning a value.

Finally, **encodeToJson** converts the respective model objects into JSON for use as part of the request body.

## Invoke the Notification Hubs REST API

The last step is updating **AppDelegate** to use **NotificationRegistrationService** to register with the **NotificationHub**.

1. Open **AppDelegate.swift** and add class-level variables to store a reference to the **NoficiationRegistrationService** and the generic **PushTemplate**:

   ```swift
   var registrationService : NotificationRegistrationService?
   let genericTemplate = PushTemplate(withBody: "{\"aps\":{\"alert\":\"$(message)\"}}")
   ```

2. In the same file, update the **didRegisterForRemoteNotificationsWithDeviceToken** function to initialize the **NotificationRegistrationService** with the requisite parameters, and then call the **register** function.

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

   For simplicity, the code uses `print` statements to update the output window with the result of the **register** operation.

3. Build and run the app on a physical device. You should see **Registered** in the output window.

## Test the solution

At this point the app is registered with **NotificationHub** and can receive push notifications. In Xcode, stop the debugger and close the app if it's currently running. Next, check that the **Device Installation** details appear as expected and that the app can now receive push notifications.

### Verify the device installation

You can now make the same request as you did previously, by using **Postman** for [verifying the SAS token](notification-hubs-ios-push-notifications-swift-apps-get-started.md#verify-the-sas-token). Assuming that the SAS token hasn't expired, the response should now include the installation details you provided, such as the templates and
tags.

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

If your previous SAS token has expired, you can add a breakpoint to line 24 of the **TokenUtility** class to get a new SAS token and update the **Authorization** header with that new value.

### Send a test notification (Azure portal)

The quickest way to test that you can now receive notifications is to browse to the notification hub in the Azure portal:

1. In the Azure portal, browse to the **Overview** tab on your notification hub.

2. Select **Test Send**, which is above the **Essentials** summary in the upper-left of the portal window:

   :::image type="content" source="media/ios-sdk-swift-rest/image2.png" alt-text="Notification Hubs essentials summary test send":::

3. Choose **Custom Template** from the **Platforms** list.

4. Enter **12345** for the **Send to Tag Expression**. You had previously specified this tag in your installation.

5. Optionally, edit the **message** in the JSON payload:

   :::image type="content" source="media/ios-sdk-swift-rest/image3.png" alt-text="Notification Hubs test send":::

6. Select **Send**. The portal should indicate whether the notification was successfully sent to the device:

   :::image type="content" source="media/ios-sdk-swift-rest/image4.png" alt-text="Test send result":::

   Assuming that the app isn't running in the foreground, you should also see a notification in the **Notification Center** on your device. Tapping the notification should open the app and show the alert.

   :::image type="content" source="media/ios-sdk-swift-rest/image5.png" alt-text="Test notification":::

### Send a test notification (mail carrier)

You can send notifications via the [REST API](/rest/api/notificationhubs/) using **Postman**, which may be a more convenient way to test.

1. Open a new tab in **Postman**.

2. Set the request to **POST**, and enter the following address:

   ```xml
   https://<namespace>.servicebus.windows.net/<hubName>/messages/?api-version=2015-01
   ```

3. Configure the request headers as follows:

   | Key                           | Value                          |
   | ----------------------------- | ------------------------------ |
   | Content-Type                  | application/json;charset=utf-8 |
   | Authorization                 | \<sasToken\>                   |
   | ServiceBusNotification-Format | template                       |
   | Tags                          | "12345"                        |

4. Configure the request **BODY** to use **RAW - JSON (application.json)** with the following JSON payload:

   ```json
   {
   "message" : "Hello from Postman!"
   }
   ```

5. Select the **Code** button, which is under the **Save** button on the upper-right of the window. The request should look similar to the following example:

   ```xml
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

6. Select the **Send** button.

You should get a **201 Created** success status code and receive the notification on the client device.

## Next steps

You now have a basic iOS Swift app connected to a notification hub via the [Notification Hubs REST API](/rest/api/notificationhubs/), and can send and receive notifications. To learn more about how to send notifications to specific devices, advance to the following tutorial:

- [Tutorial: Push notifications to specific
devices](notification-hubs-ios-xplat-segmented-apns-push-notification.md)

For more information, see the following articles:

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
