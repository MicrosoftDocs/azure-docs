<h2><a name="certificates"></a><span class="short-header">Generate CSR file</span>Generate the Certificate Signing Request file</h2>

First you must generate the Certificate Signing Request (CSR) file, which is used by Apple to generate a signed certificate.

1. From the Utilities folder, run the Keychain Access tool.

2. Click **Keychain Access**, expand **Certificate Assistant**, then click **Request a Certificate from a Certificate Authority...**.
 
  	![][5]

3. Select your **User Email Address** and **Common Name** , make sure that **Saved to disk** is selected, and then click **Continue**. Leave the **CA Email Address** field blank as it is not required.

  	![][6]

4. Type a name for the Certificate Signing Request (CSR) file in **Save As**, select the location in **Where**, then click **Save**.

  	![][7]
  
  This saves the CSR file in the selected location; the default location is in the desktop. Remember the location chosen for this file.

Next, register your app with Apple, enable push notifications, and upload this exported CSR to create a push certificate.

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

To be able to send push notifications to an iOS app from mobile services, you must register your application with Apple and also register for push notifications.  

1. If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=272456" target="_blank">iOS Provisioning Portal</a> at the Apple Developer Center, log on with your Apple ID, click **Identifiers**, then click **App IDs**, and finally click on the **+** sign to register a new app.

   	![][B102] 

2. Type a name for your app in **Description**, enter the value _MobileServices.Quickstart_ in **Bundle Identifier**, check the "Push Notifications" option in the "App Services" section, and then click **Continue**. This example uses the ID **MobileServices.Quickstart** but you may not reuse this same ID, as app IDs must be unique across all users. As such, it is recommended that you append your full name or initials after the app name. 

   	![][B103]
   
   	This generates your app ID and requests you to **Submit** the information. Click **Submit**
   
   	![][B104] 
   
   	Once you click **Submit**, you will see the **Registration complete** screen, as shown below. Click **Done**.
   
   	![][B105]

    > [WACOM.NOTE] If you choose to supply a <strong>Bundle Identifier</strong> value other than <i>MobileServices.Quickstart</i>, you must also update the bundle identifier value in your Xcode project.

3. Locate the app ID that you just created, and click on its row. 

   	![][B106]
   
   	Clicking on the app ID will display details on the app and app ID. Click the **Settings** button.
   
   	![][B107] 
   
4. Scroll to the bottom of the screen, and click the **Create Certificate...** button under the section **Development Push SSL Certificate**.

   	![][B108] 

   	This displays the "Add iOS Certificate" assistant.
   
   	![][B108] 


    > [WACOM.NOTE] This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you set the same certificate type when you upload the certificate to Mobile Services.

5. Click **Choose File**, browse to the location where you saved the CSR file that you created in the first task, then click **Generate**. 

  	![][B110]
  
6. After the certificate is created by the portal, click the **Download** button, and click **Done**.
 
  	![][B111]  

   	This downloads the signing certificate and saves it to your computer in your Downloads folder. 

  	![][B9] 

    > [WACOM.NOTE] By default, the downloaded file a development certificate is named **aps_development.cer**.

7. Double-click the downloaded push certificate **aps_development.cer**.

   	This installs the new certificate in the Keychain, as shown below:

   	![][B10]

    > [WACOM.NOTE] The name in your certificate might be different, but it will be prefixed with **Apple Development iOS Push Notification Services:**.

Later, you will use this certificate to generate a .p12 file and upload it to Mobile Services to enable authentication with APNS.


<h2><a name="profile"></a><span class="short-header">Provision the app</span>Create a provisioning profile for the app</h2>
 
1. Back in the <a href="http://go.microsoft.com/fwlink/p/?LinkId=272456" target="_blank">iOS Provisioning Portal</a>, select **Provisioning Profiles**, select **All**, and then click the **+** button to create a new profile. This displays the **Add iOS Provisioning Profile** Wizard.

   	![][120]

2. Select **iOS App Development** under **Development** as the provisioning profile type, and click **Continue**.

   	![][121]

3. Next, select the app ID for the Mobile Services Quickstart app from the **App ID** drop-down list, and click **Continue**.

   	![][122]

4. In the **Select certificates** screen, select the certificate you created earlier, and click **Continue**.
  
   	![][123]

5. Next, select the **Devices** to use for testing, and click **Continue**.

   	![][124]

6. Finally, choose a name for the profile in **Profile Name**, click **Generate**, and click **Done**.

   	![][125]
   
   	![][126]
	
	This creates a new provisioning profile.

7. In Xcode, open the Organizer, select the Devices view, select **Provisioning Profiles** in the **Library** section in the left pane, and import the provisioning profile you just created.

8. On the left, select your device, and again import the provisioning profile. 

9. In Keychain Access, right-click the new certificate, click **Export**, type a name for your certificate, select the **.p12** format, and then click **Save**.

   	![][18]

	Make a note of the file name and location of the exported certificate.
