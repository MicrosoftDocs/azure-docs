---
title: Using shared device mode with MSAL Android | Azure
description: Learn how to prepare an Android device to run in shared mode and run a firstline worker app.
services: active-directory
documentationcenter: dev-center-name
author: tylermsft
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 1/15/2020
ms.author: hahamil
ms.reviewer: brandwe
ms.custom: aaddev, identityplatformtop40
ms.collection: M365-identity-device-management
---
> [!NOTE]
> This feature is in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# Tutorial: Using Shared Device Mode in your Android Application 

## Developer Guide 

The following sections provide guidance for a developer looking to implement Shared Device Mode in their Android application using MSAL. View the [MSAL Android tutorial](https://docs.microsoft.com/azure/active-directory/develop/tutorial-v2-android) for guidance on how to integrate MSAL with your Android app, sign in a user, call Microsoft graph, and sign out a user. 

### Download the sample

Clone the [sample application](https://github.com/Azure-Samples/ms-identity-android-java/) from Github. The sample has the capability to work in [single or multi account mode](https://docs.microsoft.com/azure/active-directory/develop/single-multi-account). 

### Add the MSAL SDK to your local Maven repository
If you are not using the sample app, you will need to remember to add the MSAL library as a dependency in your build.gradle file like so: 
```gradle
dependencies{
  implementation 'com.microsoft.identity.client.msal:1.0.+'
}
```

### Configure your app to use Shared Device Mode 

Refer to the [configuration documentation](https://docs.microsoft.com/azure/active-directory/develop/msal-configuration) for more information on setting up your config file.

Set "shared_device_mode_supported" to **true** in your MSAL configuration file. 

If you are not planning on supporting "multiple account" mode (i.e. when the device is not marked as shared, the user can sign into the app with more than one account at the same time), set "account_mode" to "SINGLE. This will guarantee that your application will always get `ISingleAccountPublicClientApplication`, and will significantly simplify your MSAL integration. The default value of "account_mode" is "MULTIPLE", so it is important to change this value in the config file if you are using "single account" mode.

Example of the auth_config.json file included in the **app**>**main**>**res**>**raw** directory of our Sample app:
```JSON
{
 "client_id":"Client ID after app registration at https://aka.ms/MobileAppReg",
 "authorization_user_agent":"DEFAULT",
 "redirect_uri":"Redirect URI after app registration at https://aka.ms/MobileAppReg",
 "account_mode":"SINGLE",
 "broker_redirect_uri_registered": true,
 "shared_device_mode_supported": true,
 "authorities":[
  {
   "type":"AAD",
   "audience":{
     "type": "AzureADandPersonalMicrosoftAccount",
     "tenant_id":"common"
   }
  }
 ]
}
```
### Detecting Shared Device Mode 

`Shared Device` Mode will allow you to configure Android devices to be shared by multiple employees, while providing Microsoft Identity backed management of the device. Employees will be able to sign-in to their devices and access customer information quickly. When they are finished with their shift or task, they will be able to globally Sign-Out of all apps on the shared device with a single click and it will be immediately ready for the next employee to use.

In the code, you can use the `isSharedDevice()` flag to determine if an application is in the Shared Device Mode. Your app can use this flag to modify UX accordingly.

Code snippet from **SingleAccountModeFragment** class of the sample app showing usage of the `isSharedDevice()` flag:

```Java
deviceModeTextView.setText(mSingleAccountApp.isSharedDevice() ?"Shared" :"Non-Shared");

```

### Initializing PublicClientApplication

If you set "account_mode":"SINGLE" in the MSAL config file, you can safely perform the casting here.
```java
private ISingleAccountPublicClientApplication mSingleAccountApp; 

/*Configure your sample app and save state for this activity*/ 
PublicClientApplication.create(this.getApplicationCOntext(), 
  R.raw.auth_config, 
  new PublicClientApplication.ApplicationCreatedListener(){
  @Override
  public void onCreated(IPublicClientApplication application)(
  mSingleAccountApp = (ISingleAccountPublicCLientApplication)application;
  loadAccount();
  }
  @Override
  public void onError(MsalException exception{
  /*Fail to initialize PublicClientApplication */
  }
});  
```
### Detecting Single vs. Multi Account Mode 

If you are writing an application that will only be used for Firstline Workers on shared devices, we recommend you write your application to only support Single Account Mode. This will simplify your development as many features of the SDK won’t need to be accommodated. This includes most applications that are task focused such as Medical Records apps, Invoice apps, and most LOB apps.

If your app also supports multiple accounts as well as shared device mode, you will have to perform type check and cast to the appropriate interface to perform an operation as shown below.

```java

private IPublicClientApplication mApplication;

        if (mApplication instanceOf IMultipleAccountPublicClientApplication) {
          IMultipleAccountPublicClientApplication multipleAccountApplication = (IMultipleAccountPublicClientApplication) mApplication;
          ...
        } else if (mApplication instanceOf    ISingleAccountPublicClientApplication) {
           ISingleAccountPublicClientApplication singleAccountApplication = (ISingleAccountPublicClientApplication) mApplication;
            ...
        }
```

### Get the signed in user and determine if a user has changed on the Device

The `loadAccount` method will retrieve the account of the signed in user. The `onAccountChanged` method will determine if the signed in user has changed and perform clean up. 

```java 
private void loadAccount(){
  mSingleAccountApp.getCurrentAccountAsync(new ISingleAccountPublicClientApplication.CurrentAccountCallback(){
    @Overide
    public void onAccountLoaded(@Nullable IAccount activeAccount){
      if(activeAccount != null){
        signedInUser = activeAccount;
        mSingleAccountApp.acquireTokenSilentAsync(SCOPES,"http://login.microsoftonline.com/common",getAuthSilentCallback());
      }
    }
    @Override
    public void on AccountChanged(@Nullable IAccount priorAccount, @Nullable Iaccount currentAccount){
      if (currentAccount == null){
        //Perform a cleanup task as the signed-in account changed.
        updateSingedOutUI();
      }
    }
    @Override 
    public void onError(@NonNull Exception exception) {
    }
  }
}  
```
### Globally sign in a user
This will sign in a user accross the device to other apps using MSAL with the Authenticator App.
```java
private void onSignInClicked(){
  mSingleAccountApp.signIn(getActivity(), SCOPES, null, getAuthInteractiveCallback());
}
```
### Globally sign out a user
Remove the signed-in account and clear chached tokens from not only the app but from the deivce in Shared Device Mode. 
```java
private void onSignOutClicked(){
  mSingleAccountApp.signOut(new ISingleAccountPublicClientApplication.SignOutCallback(){
    @Override
    public void onSignOut(){
      updateSignedOutUI();
    }
    @Override
    public void onError(@NonNull MsalException exception){
      /*failed to remove account with an exception*/
    }
  });
}
```
## Administrator Guide 

The following steps describe setting up your application in the Azure portal and putting your device into Shared Device Mode. 

### Register your application in Azure Active Directory 

As a first step, you will need to register your application within your organizational tenant. You will then provide these values in to auth_config.json in order for your application to run correctly.

For information on how to do this, refer to the [tutorial](https://docs.microsoft.com/azure/active-directory/develop/tutorial-v2-android#integrate-with-microsoft-authentication-library). 

## Setup a tenant 

For testing purposes, you will want to make sure you have set up in your tenant: at least 2 employees, 1 Cloud Device Administrator, and 1 Global Administrator. In the Azure Portal, you will be able to set the Cloud Device Administrator by modifying Organizational Roles. You can access your Organizational Roles by selecting in the portal: **Azure Active Directory**>**Roles and Administrators**>**Cloud Device Administrator**. Here you will add the users that you want to be able to set the devices into Shared Mode. 

## Setup an Android device in shared mode 

#### Download the Authenticator App 

Download the Microsoft Authenticator App from the Play store. If you already have the app downloaded, update to the latest version. 

### Authenticator App settings & Registering the device in the cloud 

Launch the Authenticator App and navigate to main account page. Once you see the Add Account page, you’re ready to make the device shared. Go to the Settings pane using the right-hand menu bar. Select “Device Registration” under Work & School accounts. Note that when you click on this button, you will be asked to authorize access to device contacts. This is a consequence of using Android’s account integration on the device. You must say “allow” here. The Cloud Device Administrator should enter their organizational email under "Or register as a shared device", select the "register as shared device" button, and enter their credentials. 

This device is now in Shared Mode. Any sign-ins and sign-outs on the device will be global. You can now deploy applications to the device that leverage features of devices in Shared Device mode.

## View the shared device in the Azure portal 

Once you’ve onboarded a device in to Shared Mode, it becomes known to your Organization and is tracked in your Organizational Tenant. You can view your Shared Devices by looking at the “Join Type” in your Azure Active Directory blade of your Azure Portal.


# Next steps

Get more background on working with shared mode at [Shared device mode for Android devices](shared-device-mode.md)
