---
 author: mikeparker104
 ms.author: miparker
 ms.date: 06/02/2020
 ms.service: notification-hubs
 ms.topic: include
---

### Register your iOS app for push notifications

To send push notifications to an iOS app, register your application with Apple, and also register for push notifications.  

1. If you haven't already registered your app, browse to the [iOS Provisioning Portal](https://go.microsoft.com/fwlink/p/?LinkId=272456) at the Apple Developer Center. Sign in to the portal with your Apple ID, navigate to **Certificates, Identifiers & Profiles**, then select **Identifiers**. Click **+** to register a new app.

    ![iOS Provisioning Portal App IDs page](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-ios-appids.png)

1. On the **Register a New Identifier** screen, select the **App IDs** radio button. Then select **Continue**.

    ![iOS Provisioning Portal register new ID page](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-ios-appids-new.png)

1. Update the following three values for your new app, and then select **Continue**:

   * **Description**: Type a descriptive name for your app.

   * **Bundle ID**: Enter a Bundle ID of the form **com.<organization_identifier>.<product_name>** as mentioned in the [App Distribution Guide](https://help.apple.com/xcode/mac/current/#/dev91fe7130a). In the following screenshot, the `mobcat` value is used as an organization identifier and the **PushDemo** value is used as the product name.

      ![iOS Provisioning Portal register app ID page](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-new-appid-bundle.png)

   * **Push Notifications**: Check the **Push Notifications** option in the **Capabilities** section.

      ![Form to register a new App ID](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-new-appid-push.png)

      This action generates your App ID and requests that you confirm the information. Select **Continue**, then select **Register** to confirm the new App ID.

      ![Confirm new App ID](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-new-appid-register.png)

      After you select **Register**, you see the new App ID as a line item in the **Certificates, Identifiers & Profiles** page.

1. In the **Certificates, Identifiers & Profiles** page, under **Identifiers**, locate the App ID line item that you created. Then, select its row to display the **Edit your App ID Configuration** screen.

#### Creating a certificate for Notification Hubs

A certificate is required to enable the notification hub to work with **Apple Push Notification Services (APNS)** and can be provided in one of two ways:

1. [Creating a p12 push certificate that can be uploaded directly to Notification Hub](#option-1-creating-a-p12-push-certificate-that-can-be-uploaded-directly-to-notification-hub) (*the original approach*)

1. [Creating a p8 certificate that can be used for token-based authentication](#option-2-creating-a-p8-certificate-that-can-be-used-for-token-based-authentication) (*the newer and recommended approach*)

The newer approach has a number of benefits as documented in [Token-based (HTTP/2) authentication for APNS](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-http2-token-authentification). Fewer steps are required but is also mandated for specific scenarios. However, steps have been provided for both approaches since either will work for the purposes of this tutorial.

##### OPTION 1: Creating a p12 push certificate that can be uploaded directly to Notification Hub

1. On your Mac, run the Keychain Access tool. It can be opened from the **Utilities** folder or the **Other** folder on the Launchpad.

1. Select **Keychain Access**, expand **Certificate Assistant**, and then select **Request a Certificate from a Certificate Authority**.

    ![Use Keychain Access to request a new certificate](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-request-cert-from-ca.png)

   > [!NOTE]
   > By default, Keychain Access selects the first item in the list. This can be a problem if you're in the **Certificates** category and **Apple Worldwide Developer Relations Certification Authority** is not the first item in the list. Make sure you have a non-key item, or the **Apple Worldwide Developer Relations Certification Authority** key is selected, before generating the CSR (Certificate Signing Request).

1. Select your **User Email Address**, enter your **Common Name** value, make sure that you specify **Saved to disk**, and then select **Continue**. Leave **CA Email Address** blank as it isn't required.

    ![Expected certificate information](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-csr-info.png)

1. Enter a name for the **Certificate Signing Request (CSR) file** in **Save As**, select the location in **Where**, and then select **Save**.

    ![Choose a file name for the certificate](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-save-csr.png)

    This action saves the **CSR file** in the selected location. The default location is **Desktop**. Remember the location chosen for the file.

1. Back on the **Certificates, Identifiers & Profiles** page in the [iOS Provisioning Portal](https://go.microsoft.com/fwlink/p/?LinkId=272456), scroll down to the checked **Push Notifications** option, and then select **Configure** to create the certificate.

    ![Edit App ID page](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-edit-appid.png)

1. The **Apple Push Notification service TLS/SSL Certificates** window appears. Select the **Create Certificate** button under the **Development TLS/SSL Certificate** section.

    ![Create certificate for App ID button](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-appid-create-cert.png)

    The **Create a new Certificate** screen is displayed.

    > [!NOTE]
    > This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you use the same certificate type when sending notifications.

1. Select **Choose File**, browse to the location where you saved the **CSR file**, and then double-click the certificate name to load it. Then select **Continue**.

1. After the portal creates the certificate, select the **Download** button. Save the certificate, and remember the location to which it's saved.

    ![Generated certificate download page](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-appid-download-cert.png)

    The certificate is downloaded and saved to your computer in your **Downloads** folder.

    ![Locate certificate file in the Downloads folder](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-cert-downloaded.png)

    > [!NOTE]
    > By default, the downloaded development certificate is named **aps_development.cer**.

1. Double-click the downloaded push certificate **aps_development.cer**. This action installs the new certificate in the Keychain, as shown in the following image:

    ![Keychain access certificates list showing new certificate](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-cert-in-keychain.png)

    > [!NOTE]
    > Although the name in your certificate might be different, the name will be prefixed with **Apple Development iOS Push Services** and have the appropriate bundle identifier associated with it.

1. In Keychain Access, **Control** + **Click** on the new push certificate that you created in the **Certificates** category. Select **Export**, name the file, select the **p12** format, and then select **Save**.

    ![Export certificate as p12 format](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-export-cert-p12.png)

    You can choose to protect the certificate with a password, but a password is optional. Click **OK** if you want to bypass password creation. Make a note of the file name and location of the exported p12 certificate. They're used to enable authentication with APNs.

    > [!NOTE]
    > Your p12 file name and location might be different than what is pictured in this tutorial.

##### OPTION 2: Creating a p8 certificate that can be used for token-based authentication

1. Make note of the following details:

    * **App ID Prefix** (**Team ID**)
    * **Bundle ID**

1. Back in **Certificates, Identifiers & Profiles**, click **Keys**.

   > [!NOTE]
   > If you already have a key configured for **APNS**, you can re-use the p8 certificate that you downloaded right after it was created. If so, you can ignore steps **3** through **5**.

1. Click the **+** button (or the **Create a key** button) to create a new key.
1. Provide a suitable **Key Name** value, then check the **Apple Push Notifications service (APNS)** option, and then click **Continue**, followed by **Register** on the next screen.
1. Click **Download** and then move the **p8** file (prefixed with *AuthKey_*) to a secure local directory, then click **Done**.

   > [!NOTE]
   > Be sure to keep your p8 file in a secure place (and save a backup). After downloading your key, it cannot be re-downloaded as the server copy is removed.
  
1. On **Keys**, click on the key that you created (or an existing key if you have chosen to use that instead).
1. Make note of the **Key ID** value.
1. Open your p8 certificate in a suitable application of your choice such as [**Visual Studio Code**](https://code.visualstudio.com). Make note of the key value (between **-----BEGIN PRIVATE KEY-----** and **-----END PRIVATE KEY-----**).

    -----BEGIN PRIVATE KEY-----  
    <key_value>  
    -----END PRIVATE KEY-----

    > [!NOTE]
    > This is the **token value** that will be used later to configure **Notification Hub**.

At the end of these steps, you should have the following information for use later in [Configure your notification hub with APNS information](#configure-your-notification-hub-with-apns-information):

* **Team ID** (see step 1)
* **Bundle ID** (see step 1)
* **Key ID** (see step 7)
* **Token value** (p8 key value obtained in step 8)

### Create a provisioning profile for the app

1. Return to the [iOS Provisioning Portal](https://go.microsoft.com/fwlink/p/?LinkId=272456), select **Certificates, Identifiers & Profiles**, select **Profiles** from the left menu, and then select **+** to create a new profile. The **Register a New Provisioning Profile** screen appears.

1. Select **iOS App Development** under **Development** as the provisioning profile type, and then select **Continue**.

    ![Provisioning profile list](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-new-provisioning-profile.png)

1. Next, select the app ID you created from the **App ID** drop-down list, and select **Continue**.

    ![Select the App ID](./media/notification-hubs-common-enable-apple-push-notifications/notification-hubs-select-appid-for-provisioning.png)

1. In the **Select certificates** window, select the development certificate that you use for code signing, and select **Continue**.

    > [!NOTE]
    > This certificate is not the push certificate you created in the [previous step](#creating-a-certificate-for-notification-hubs). This is your development certificate. If one does not exist, you must create it since this is a [prerequisite](#prerequisites) for this tutorial. Developer certificates can be created in the [Apple Developer Portal](https://developer.apple.com), via [Xcode](https://developer.apple.com/library/archive/documentation/ToolsLanguages/Conceptual/YourFirstAppStoreSubmission/ProvisionYourDevicesforDevelopment/ProvisionYourDevicesforDevelopment.html) or in [Visual Studio](https://docs.microsoft.com/xamarin/ios/get-started/installation/device-provisioning/).

1. Return to the **Certificates, Identifiers & Profiles** page, select **Profiles** from the left menu, and then select **+** to create a new profile. The **Register a New Provisioning Profile** screen appears.

1. In the **Select certificates** window, select the development certificate that you created. Then select **Continue**.

1. Next, select the devices to use for testing, and select **Continue**.

1. Finally, choose a name for the profile in **Provisioning Profile Name**, and select **Generate**.

    ![Choose a provisioning profile name](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-provisioning-name-profile.png)

1. When the new provisioning profile is created, select **Download**. Remember the location to which it's saved.

1. Browse to the location of the provisioning profile, and then double-click it to install it on your development machine.
