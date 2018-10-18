---
title: Azure Storage Explorer troubleshooting guide | Microsoft Docs
description: Overview of the two debugging feature of Azure
services: virtual-machines
author: Deland-Han
ms.service: virtual-machines
ms.topic: troubleshooting
ms.date: 06/15/2018
ms.author: delhan
ms.component: common
---

# Azure Storage Explorer troubleshooting guide

Microsoft Azure Storage Explorer is a stand-alone app that enables you to easily work with Azure Storage data on Windows, macOS, and Linux. The app can connect to Storage accounts hosted on Azure, National Clouds, and Azure Stack.

This guide summarizes solutions for common issues seen in Storage Explorer.

## Error: Self-Signed Certificate in Certificate Chain (and similar errors)

Certificate errors are caused by one of the two following situations:

1. The app is connected through a "transparent proxy", which means a server (such as your company server) is intercepting HTTPS traffic, decrypting it, and then encrypting it using a self-signed certificate.
2. You are running an application that is injecting a self-signed SSL certificate into the HTTPS messages that you receive. Examples of applications that do inject certificates includes anti-virus and network traffic inspection software.

When Storage Explorer sees a self signed or untrusted certificate, it can no longer know whether the received HTTPS message has been altered. If you have a copy of the self-signed certificate, you can instruct Storage Explorer trust it by doing the following steps:

1. Obtain a Base-64 encoded X.509 (.cer) copy of the certificate
2. Click **Edit** > **SSL Certificates** > **Import Certificates**, and then use the file picker to find, select, and open the .cer file

This issue may also be the result of multiple certificates (root and intermediate). Both certificates must be added to overcome the error.

If you are unsure of where the certificate is coming from, you can try these steps to find it:

1. Install Open SSL

    * [Windows](https://slproweb.com/products/Win32OpenSSL.html) (any of the light versions should be sufficient)
    * Mac and Linux: should be included with your operating system
2. Run Open SSL

    * Windows: open the installation directory, click **/bin/**, and then double-click **openssl.exe**.
    * Mac and Linux: run **openssl** from a terminal.
3. Execute `s_client -showcerts -connect microsoft.com:443`
4. Look for self-signed certificates. If you are unsure which are self-signed, look for anywhere the subject `("s:")` and issuer `("i:")` are the same.
5. When you have found any self-signed certificates, for each one, copy and paste everything from and including **-----BEGIN CERTIFICATE-----** to **-----END CERTIFICATE-----** to a new .cer file.
6. Open Storage Explorer, click **Edit** > **SSL Certificates** > **Import Certificates**, and then use the file picker to find, select, and open the .cer files that you created.

If you cannot find any self-signed certificates using the preceding steps, contact us through the feedback tool for more help. Alternatively, you can choose to launch Storage Explorer from the command line with the `--ignore-certificate-errors` flag. When launched with this flag, Storage Explorer will ignore certificate errors.

## Sign-in issues

### Reauthentication loop or UPN change
If you are in a reauthentication loop, or have changed the UPN of one of your accounts, try the following:
1. Remove all accounts and then close Storage Explorer
2. Delete the .IdentityService folder from your machine. On Windows, the folder is located at `C:\users\<username>\AppData\Local`. For Mac and Linux, you can find the folder at the root of your user directory.
3. If you are on Mac or Linux, you will also need to delete the Microsoft.Developer.IdentityService entry from your OS' keystore. On Mac, the keystore is the "Gnome Keychain" application. For Linux, the application is usually called "Keyring", but the name may be different depending on your distribution.

## Mac Keychain errors
The macOS Keychain can sometimes get into a state that causes issues for Storage Explorer's authentication library. To get the keychain out of this state try the following steps:
1. Close Storage Explorer.
2. Open keychain (**cmd+space**, type in keychain, hit enter).
3. Select the "login" keychain.
4. Click the padlock icon to lock the keychain (the padlock will animate to a locked position when complete, it may take a few seconds depending on what apps you have open).

    ![image](./media/storage-explorer-troubleshooting/unlockingkeychain.png)

5. Launch Storage Explorer.
6. A pop-up should appear saying something like "Service hub wants to access the keychain". When it does, enter your Mac admin account password and click **Always Allow** (or **Allow** if **Always Allow** is not available).
7. Try to sign in.

### General sign-in troubleshooting steps
* If you are on macOS and the sign-in window never appears over the "Waiting for authentication..." dialog, then try [these steps](#Mac-Keychain-Errors)
* Restart Storage Explorer
* If the authentication window is blank, wait at least one minute before closing the authentication dialog box.
* Ensure that your proxy and certificate settings are properly configured for both your machine and Storage Explorer.
* If you are on Windows and have access to Visual Studio 2017 on the same machine and login, try signing in to Visual Studio 2017. After a successful sign-in to Visual Studio 2017, you should be able to open Storage Explorer and see your account in the account panel. 

If none of these methods work [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues).

### Missing subscriptions and broken tenants

If you are unable to retrieve your subscriptions after you successfully sign in, try the following troubleshooting methods:

* Verify that your account has access to the subscriptions you expect. You can verify that you have access by signing into portal for the Azure environment you are trying to use.
* Make sure that you have signed in using the correct Azure environment (Azure, Azure China, Azure Germany, Azure US Government, or Custom Environment).
* If you are behind a proxy, make sure that you have configured the Storage Explorer proxy properly.
* Try removing and readding the account.
* If there is a "More information" link, look and see what error messages are being reported for the tenants that are failing. If you are not sure what to do with the error messages you see, then feel free to [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues).

## Cannot remove attached account or storage resource

If you are unable to remove an attached account or storage resource through the UI, you can manually delete all attached resources by deleting the following folders:

* Windows: `%AppData%/StorageExplorer`
* macOS: `/Users/<your_name>/Library/Applicaiton Support/StorageExplorer`
* Linux: `~/.config/StorageExplorer`

> [!NOTE]
>  Close Storage Explorer before deleting the above folders.

> [!NOTE]
>  If you have ever imported any SSL certificates then backup the contents of the `certs` directory. Later, you can use the backup to reimport your SSL certificates.

## Proxy issues

First, make sure that the following information you entered are all correct:

* The proxy URL and port number
* Username and password if required by the proxy

### Common solutions

If you are still experiencing issues, try the following troubleshooting methods:

* If you can connect to the Internet without using your proxy, verify that Storage Explorer works without proxy settings enabled. If this is the case, there may be an issue with your proxy settings. Work with your proxy administrator to identify the problems.
* Verify that other applications using the proxy server work as expected.
* Verify that you can connect to the portal for the Azure environment you are trying to use
* Verify that you can receive responses from your service endpoints. Enter one of your endpoint URLs into your browser. If you can connect, you should receive an InvalidQueryParameterValue or similar XML response.
* If someone else is also using Storage Explorer with your proxy server, verify that they can connect. If they can connect, you may have to contact your proxy server admin.

### Tools for diagnosing issues

If you have networking tools, such as Fiddler for Windows, you may be able to diagnose the problems as follows:

* If you have to work through your proxy, you may have to configure your networking tool to connect through the proxy.
* Check the port number used by your networking tool.
* Enter the local host URL and the networking tool's port number as proxy settings in Storage Explorer. When done correctly, your networking tool starts logging network requests made by Storage Explorer to management and service endpoints. For example, enter https://cawablobgrs.blob.core.windows.net/ for your blob endpoint in a browser, and you will receive a response resembles the following, which suggests the resource exists, although you cannot access it.

![code sample](./media/storage-explorer-troubleshooting/4022502_en_2.png)

### Contact proxy server admin

If your proxy settings are correct, you may have to contact your proxy server admin, and

* Make sure that your proxy does not block traffic to Azure management or resource endpoints.
* Verify the authentication protocol used by your proxy server. Storage Explorer does not currently support NTLM proxies.

## "Unable to Retrieve Children" error message

If you are connected to Azure through a proxy, verify that your proxy settings are correct. If you were granted access to a resource from the owner of the subscription or account, verify that you have read or list permissions for that resource.

## Issues with SAS URL
If you're connecting to a service using a SAS URL and experiencing this error:

* Verify that the URL provides the necessary permissions to read or list resources.
* Verify that the URL has not expired.
* If the SAS URL is based on an access policy, verify that the access policy has not been revoked.

If you accidentally attached using an invalid SAS URL and are unable to detach, follow these steps:
1.	When running Storage Explorer, press F12 to open the developer tools window.
2.	Click the Application tab, then click Local Storage > file:// in the tree on the left.
3.	Find the key associated with the service type of the problematic SAS URI. For example, if the bad SAS URI is for a blob container, look for the key named `StorageExplorer_AddStorageServiceSAS_v1_blob`.
4.	The value of the key should be a JSON array. Find the object associated with the bad URI and remove it.
5.	Press Ctrl+R to reload Storage Explorer.

## Linux dependencies

For Linux distros other than Ubuntu 16.04, you may need to manually install some dependencies. In general, the following packages are required:
* [.NET Core 2.x](https://docs.microsoft.com/dotnet/core/linux-prerequisites?tabs=netcore2x)
* `libsecret`
* `libgconf-2-4`
* Up-to-date GCC

Depending on your distro, there may be other packages you need to install. The Storage Explorer [Release Notes](https://go.microsoft.com/fwlink/?LinkId=838275&clcid=0x409) contain specific steps for some distros.

## Next steps

If none of the solutions work for you, then [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues). You can also quickly get to GitHub by using the "Report issue to GitHub" button in the bottom left-hand corner.

![Feedback](./media/storage-explorer-troubleshooting/feedback-button.PNG)
