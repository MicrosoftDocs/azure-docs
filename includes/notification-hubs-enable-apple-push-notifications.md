---
title: include file
description: include file
services: notification-hubs
author: sethmanheim
ms.service: notification-hubs
ms.topic: include
ms.date: 02/10/2020
ms.author: sethm
ms.custom: include file
---
## Generate the certificate-signing request file

The Apple Push Notification Service (APNs) uses certificates to authenticate your push notifications. Follow these instructions to create the necessary push certificate to send and receive notifications. For more information on these concepts, see the official [Apple Push Notification Service](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html) documentation.

Generate the Certificate Signing Request (CSR) file, which Apple uses to generate a signed push certificate.

1. On your Mac, run the Keychain Access tool. It can be opened from the **Utilities** folder or the **Other** folder on the Launchpad.

1. Select **Keychain Access**, expand **Certificate Assistant**, and then select **Request a Certificate from a Certificate Authority**.

    ![Use Keychain Access to request a new certificate](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-request-cert-from-ca.png)

   > [!NOTE]
   > By default, Keychain Access selects the first item in the list. This can be a problem if you're in the **Certificates** category and **Apple Worldwide Developer Relations Certification Authority** is not the first item in the list. Make sure you have a non-key item, or the **Apple Worldwide Developer Relations Certification Authority** key is selected, before generating the CSR (Certificate Signing Request).

1. Select your **User Email Address**, enter your **Common Name** value, make sure that you specify **Saved to disk**, and then select **Continue**. Leave **CA Email Address** blank as it isn't required.

    ![Required certificate information](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-csr-info.png)

1. Enter a name for the CSR file in **Save As**, select the location in **Where**, and then select **Save**.

    ![Choose a file name for the certificate](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-save-csr.png)

    This action saves the CSR file in the selected location. The default location is **Desktop**. Remember the location chosen for the file.

Next, register your app with Apple, enable push notifications, and upload the exported CSR to create a push certificate.

## Register your app for push notifications

To send push notifications to an iOS app, register your application with Apple, and also register for push notifications.  

1. If you haven't already registered your app, browse to the [iOS Provisioning Portal](https://go.microsoft.com/fwlink/p/?LinkId=272456) at the Apple Developer Center. Sign in to the portal with your Apple ID, and select **Identifiers**. Then select **+** to register a new app.

    ![iOS Provisioning Portal App IDs page](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-ios-appids.png)

2. On the **Register a New Identifier** screen, select the **App IDs** radio button. Then select **Continue**.

    ![iOS Provisioning Portal register new ID page](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-ios-appids-new.png)

3. Update the following three values for your new app, and then select **Continue**:

   * **Description**: Type a descriptive name for your app.

   * **Bundle ID**: Enter a Bundle ID of the form **Organization Identifier.Product Name** as mentioned in the [App Distribution Guide](https://help.apple.com/xcode/mac/current/#/dev91fe7130a). The *Organization Identifier* and *Product Name* values must match the organization identifier and product name you use when you create your Xcode project. In the following screenshot, the **NotificationHubs** value is used as an organization identifier and the **GetStarted** value is used as the product name. Make sure the **Bundle Identifier** value matches the value in your Xcode project, so that Xcode uses the correct publishing profile.

      ![iOS Provisioning Portal register app ID page](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-new-appid-bundle.png)

   * **Push Notifications**: Check the **Push Notifications** option in the **Capabilities** section.

      ![Form to register a new App ID](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-new-appid-push.png)

      This action generates your App ID and requests that you confirm the information. Select **Continue**, then select **Register** to confirm the new App ID.

      ![Confirm new App ID](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-new-appid-register.png)

      After you select **Register**, you see the new App ID as a line item in the **Certificates, Identifiers & Profiles** page.

4. In the **Certificates, Identifiers & Profiles** page, under **Identifiers**, locate the App ID line item that you just created, and select its row to display the **Edit your App ID Configuration** screen.

## Creating a Certificate for Notification Hubs
A certificate is required to enable the notification hub to work with **APNS**. This can be done in one of two ways:

1. Create a **.p12** that can be uploaded directly to Notification Hub.  
2. Create a **.p8** that can be used for [token-based authentication](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-http2-token-authentification) (*the newer approach*).

The newer approach has a number of benefits (compared to using certificates) as documented in [Token-based (HTTP/2) authentication for APNS](https://docs.microsoft.com/azure/notification-hubs/notification-hubs-push-notification-http2-token-authentification). However, steps have been provided for both approaches. 

### OPTION 1: Creating a .p12 push certificate that can be uploaded directly to Notification Hub

1. Scroll down to the checked **Push Notifications** option, and then select **Configure** to create the certificate.

    ![Edit App ID page](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-edit-appid.png)

2. The **Apple Push Notification service SSL Certificates** window appears. Select the **Create Certificate** button under the **Development SSL Certificate** section.

    ![Create certificate for App ID button](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-appid-create-cert.png)

    The **Create a new Certificate** screen is displayed.

    > [!NOTE]
    > This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you use the same certificate type when sending notifications.

3. Select **Choose File**, browse to the location where you saved the CSR file from the first task, and then double-click the certificate name to load it. Then select **Continue**.

4. After the portal creates the certificate, select the **Download** button. Save the certificate, and remember the location to which it's saved.

    ![Generated certificate download page](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-appid-download-cert.png)

    The certificate is downloaded and saved to your computer in your **Downloads** folder.

    ![Locate certificate file in the Downloads folder](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-cert-downloaded.png)

    > [!NOTE]
    > By default, the downloaded development certificate is named **aps_development.cer**.

5. Double-click the downloaded push certificate **aps_development.cer**. This action installs the new certificate in the Keychain, as shown in the following image:

    ![Keychain access certificates list showing new certificate](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-cert-in-keychain.png)

    > [!NOTE]
    > Although the name in your certificate might be different, the name will be prefixed with **Apple Development iOS Push Services**.

6. In Keychain Access, right-click the new push certificate that you created in the **Certificates** category. Select **Export**, name the file, select the **.p12** format, and then select **Save**.

    ![Export certificate as p12 format](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-export-cert-p12.png)

    You can choose to protect the certificate with a password, but this is optional. Click **OK** if you want to bypass password creation. Make a note of the file name and location of the exported .p12 certificate. They are used to enable authentication with APNs.

    > [!NOTE]
    > Your .p12 file name and location might be different than what is pictured in this tutorial.

### OPTION 2: Creating a .p8 certificate that can be used for token-based authentication

1. Make note of the following details:

    - **App ID Prefix** (this is a **Team ID**)
    - **Bundle ID**
    
2. Back in **Certificates, Identifiers & Profiles**, click **Keys**.

   > [!NOTE]
   > If you already have a key configured for **APNS**, you can re-use the .p8 certificate that you downloaded right after it was created. If so, you can ignore steps **3** through **5**.

3. Click the **+** button (or the **Create a key** button) to create a new key.
4. Provide a suitable **Key Name** value, then check the **Apple Push Notifications service (APNs)** option, and then click **Continue**, followed by **Register** on the next screen.
5. Click **Download** and then move the **.p8** file (prefixed with *AuthKey_*) to a secure local directory, then click **Done**.

   > [!NOTE] 
   > Be sure to keep your .p8 file in a secure place (and save a backup). After downloading your key, it cannot be re-downloaded as the server copy is removed.
  
6. On **Keys**, click on the key that you just created (or an existing key if you have chosen to use that instead).
7. Make note of the **Key ID** value.
8. Open your .p8 certificate in a suitable application of your choice such as [**Visual Studio Code**](https://code.visualstudio.com) then make note of the key value. This is the value between **-----BEGIN PRIVATE KEY-----** and **-----END PRIVATE KEY-----** .

    ```
    -----BEGIN PRIVATE KEY-----
    <key_value>
    -----END PRIVATE KEY-----
    ```

    > [!NOTE]
    > This is the **token value** that will be used later to configure **Notification Hub**. 

At the end of these steps you should have the following information for use later in [Configure your notification hub with APNs information](#configure-your-notification-hub-with-apns-information):

- **Team ID** (see step 1)
- **Bundle ID** (see step 1)
- **Key ID** (see step 7)
- **Token value** i.e. the .p8 key value (see step 8)

## Create a provisioning profile for the app

1. Return to the [iOS Provisioning Portal](https://go.microsoft.com/fwlink/p/?LinkId=272456), select **Certificates, Identifiers & Profiles**, select **Profiles** from the left menu, and then select **+** to create a new profile. The **Register a New Provisioning Profile** screen appears.

1. Select **iOS App Development** under **Development** as the provisioning profile type, and then select **Continue**.

    ![Provisioning profile list](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-new-provisioning-profile.png)

1. Next, select the app ID you created from the **App ID** drop-down list, and select **Continue**.

    ![Select the App ID](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-select-appid-for-provisioning.png)

1. In the **Select certificates** window, select the development certificate that you use for code signing, and select **Continue**. This certificate isn't the push certificate you created. If one does not exist, you must create it. If a certificate does exist, skip to the next step. To create a development certificate if one does not exist:

    1. If you see **No Certificates are available**, select **Create Certificate**.
    2. In the **Software** section, select **Apple Development**. Then select **Continue**.
    3. In the **Create a New Certificate** screen, select **Choose File**.
    4. Browse to the **Certificate Signing Request** certificate you created earlier, select it, and then select **Open**.
    5. Select **Continue**.
    6. Download the development certificate, and remember the location to which it's saved.

1. Return to the **Certificates, Identifiers & Profiles** page, select **Profiles** from the left menu, and then select **+** to create a new profile. The **Register a New Provisioning Profile** screen appears.

1. In the **Select certificates** window, select the development certificate that you just created. Then select **Continue**.

1. Next, select the devices to use for testing, and select **Continue**.

1. Finally, choose a name for the profile in **Provisioning Profile Name**, and select **Generate**.

    ![Choose a provisioning profile name](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-provisioning-name-profile.png)

1. When the new provisioning profile is created, select **Download**. Remember the location to which it's saved.

1. Browse to the location of the provisioning profile, and then double-click it to install it on your Xcode development machine.

## Create a notification hub

In this section, you create a notification hub and configure authentication with APNs by using either the .p12 push certificate or token-based authentication. If you want to use a notification hub that you've already created, you can skip to step 5.

[!INCLUDE [notification-hubs-portal-create-new-hub](notification-hubs-portal-create-new-hub.md)]

## Configure your notification hub with APNs information

Under **Notification Services**, select **Apple (APNS)** then follow the appropriate steps based on the approach you chose previously in the [Creating a Certificate for Notification Hubs](#creating-a-certificate-for-notification-hubs) section.  

> [!NOTE]
> Use the **Production** for **Application Mode** only if you want to send push notifications to users who purchased your app from the store.

### OPTION 1: Using a .p12 push certificate

1. Select **Certificate**.

1. Select the file icon.

1. Select the .p12 file that you exported earlier, and then select **Open**.

1. If required, specify the correct password.

1. Select **Sandbox** mode.

    ![Configure APNs certification in Azure portal](./media/notification-hubs-enable-apple-push-notifications/notification-hubs-apple-config-cert.png)

1. Select **Save**.

### OPTION 2: Using token-based authentication

1. Select **Token**.
1. Enter the following values that you acquired earlier:

    - **Key ID**
    - **Bundle ID**
    - **Team ID**
    - **Token** 

1. Choose **Sandbox**
1. Select **Save**. 

You've now configured your notification hub with APNs. You also have the connection strings to register your app and send push notifications.
