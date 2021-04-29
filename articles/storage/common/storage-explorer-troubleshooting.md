---
title: Azure Storage Explorer troubleshooting guide | Microsoft Docs
description: Overview of debugging techniques for Azure Storage Explorer
services: storage
author: Deland-Han
manager: dcscontentpm
ms.service: storage
ms.topic: troubleshooting
ms.date: 07/28/2020
ms.author: delhan
---

# Azure Storage Explorer troubleshooting guide

Microsoft Azure Storage Explorer is a standalone app that makes it easy to work with Azure Storage data on Windows, macOS, and Linux. The app can connect to storage accounts hosted on Azure, national clouds, and Azure Stack.

This guide summarizes solutions for issues that are commonly seen in Storage Explorer.

## Azure RBAC permissions issues

Azure role-based access control [Azure RBAC](../../role-based-access-control/overview.md) enables highly granular access management of Azure resources by combining sets of permissions into _roles_. Here are some strategies to get Azure RBAC working optimally in Storage Explorer.

### How do I access my resources in Storage Explorer?

If you're having problems accessing storage resources through Azure RBAC, you might not have been assigned the appropriate roles. The following sections describe the permissions Storage Explorer currently requires for access to your storage resources. Contact your Azure account administrator if you're not sure you have the appropriate roles or permissions.

#### "Read: List/Get Storage Account(s)" permissions issue

You must have permission to list storage accounts. To get this permission, you must be assigned the _Reader_ role.

#### List storage account keys

Storage Explorer can also use account keys to authenticate requests. You can get access to account keys through more powerful roles, such as the _Contributor_ role.

> [!NOTE]
> Access keys grant unrestricted permissions to anyone who holds them. Therefore, we don't recommend that you hand out these keys to account users. If you need to revoke access keys, you can regenerate them from the [Azure portal](https://portal.azure.com/).

#### Data roles

You must be assigned at least one role that grants access to read data from resources. For example, if you want to list or download blobs, you'll need at least the _Storage Blob Data Reader_ role.

### Why do I need a management layer role to see my resources in Storage Explorer?

Azure Storage has two layers of access: _management_ and _data_. Subscriptions and storage accounts are accessed through the management layer. Containers, blobs, and other data resources are accessed through the data layer. For example, if you want to get a list of your storage accounts from Azure, you send a request to the management endpoint. If you want a list of blob containers in an account, you send a request to the appropriate service endpoint.

Azure roles can grant you permissions for management or data layer access. The Reader role, for example, grants read-only access to management layer resources.

Strictly speaking, the Reader role provides no data layer permissions and isn't necessary for accessing the data layer.

Storage Explorer makes it easy to access your resources by gathering the necessary information to connect to your Azure resources. For example, to display your blob containers, Storage Explorer sends a "list containers" request to the blob service endpoint. To get that endpoint, Storage Explorer searches the list of subscriptions and storage accounts you have access to. To find your subscriptions and storage accounts, Storage Explorer also needs access to the management layer.

If you don’t have a role that grants any management layer permissions, Storage Explorer can’t get the information it needs to connect to the data layer.

### What if I can't get the management layer permissions I need from my administrator?

If you want to access blob containers, ADLS Gen2 containers or directories, or queues, you can attach to those resources using your Azure credentials.

1. Open the Connect dialog.
1. Select the resource type you want to connect to.
1. Select **Sign in using Azure Active Directory (Azure AD)**. Select **Next**.
1. Select the user account and tenant associated with the resource you're attaching to. Select **Next**.
1. Enter the URL to the resource, and enter a unique display name for the connection. Select **Next** then **Connect**.

For other resource types, we don't currently have an Azure RBAC-related solution. As a workaround, you can request a SAS URL then attach to your resource by following these steps:

1. Open the Connect dialog.
1. Select the resource type you want to connect to.
1. Select **Shared access signature (SAS)**. Select **Next**.
1. Enter the SAS URL you received and enter a unique display name for the connection. Select **Next** then **Connect**.
 
For more information on attaching to resources, see [Attach to an Individual Resource](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=linux#attach-to-an-individual-resource).

### Recommended Azure built-in roles

There are several Azure built-in roles that can provide the permissions needed to use Storage Explorer. Some of those roles are:
- [Owner](../../role-based-access-control/built-in-roles.md#owner): Manage everything, including access to resources.
- [Contributor](../../role-based-access-control/built-in-roles.md#contributor): Manage everything, excluding access to resources.
- [Reader](../../role-based-access-control/built-in-roles.md#reader): Read and list resources.
- [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor): Full management of storage accounts.
- [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner): Full access to Azure Storage blob containers and data.
- [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor): Read, write, and delete Azure Storage containers and blobs.
- [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader): Read and list Azure Storage containers and blobs.

> [!NOTE]
> The Owner, Contributor, and Storage Account Contributor roles grant account key access.

## Error: Self-signed certificate in certificate chain (and similar errors)

Certificate errors typically occur in one of the following situations:

- The app is connected through a _transparent proxy_. This means a server (such as your company server) is intercepting HTTPS traffic, decrypting it, and then encrypting it by using a self-signed certificate.
- You're running an application that's injecting a self-signed TLS/SSL certificate into the HTTPS messages that you receive. Examples of applications that inject certificates include antivirus and network traffic inspection software.

When Storage Explorer sees a self-signed or untrusted certificate, it no longer knows whether the received HTTPS message has been altered. If you have a copy of the self-signed certificate, you can instruct Storage Explorer to trust it by following these steps:

1. Obtain a Base-64 encoded X.509 (.cer) copy of the certificate.
2. Go to **Edit** > **SSL Certificates** > **Import Certificates**, and then use the file picker to find, select, and open the .cer file.

This issue may also occur if there are multiple certificates (root and intermediate). To fix this error, both certificates must be added.

If you're unsure of where the certificate is coming from, follow these steps to find it:

1. Install OpenSSL.
    * [Windows](https://slproweb.com/products/Win32OpenSSL.html): Any of the light versions should be sufficient.
    * Mac and Linux: Should be included with your operating system.
2. Run OpenSSL.
    * Windows: Open the installation directory, select **/bin/**, and then double-click **openssl.exe**.
    * Mac and Linux: Run `openssl` from a terminal.
3. Run `s_client -showcerts -connect microsoft.com:443`.
4. Look for self-signed certificates. If you're unsure of which certificates are self-signed, make note of anywhere the subject `("s:")` and issuer `("i:")` are the same.
5. When you find self-signed certificates, for each one, copy and paste everything from (and including) `-----BEGIN CERTIFICATE-----` through `-----END CERTIFICATE-----` into a new .cer file.
6. Open Storage Explorer and go to **Edit** > **SSL Certificates** > **Import Certificates**. Then use the file picker to find, select, and open the .cer files that you created.

If you can't find any self-signed certificates by following these steps, contact us through the feedback tool. You can also open Storage Explorer from the command line by using the `--ignore-certificate-errors` flag. When opened with this flag, Storage Explorer ignores certificate errors.

## Sign-in issues

### Understanding sign-in

Make sure you have read the [Sign in to Storage Explorer](./storage-explorer-sign-in.md) documentation.

### Frequently having to reenter credentials

Having to reenter credentials is most likely the result of conditional access policies set by your AAD administrator. When Storage Explorer asks you to reenter credentials from the account panel, you should see an **Error details...** link. Click on that to see why Storage Explorer is asking you to reenter credentials. Conditional access policy errors that require reentering of credentials may look something like these:
- The refresh token has expired...
- You must use multi-factor authentication to access...
- Due to a configuration change made by your administrator...

To reduce the frequency of having to reenter credentials due to errors like the ones above, you will need to talk to your AAD administrator.

### Conditional access policies

If you have conditional access policies that need to be satisfied for your account, make sure you are using the **Default Web Browser** value for the **Sign in with** setting. For information on that setting, see [Changing where sign in happens](./storage-explorer-sign-in.md#changing-where-sign-in-happens).

### Browser complains about HTTP redirect during sign in

When Storage Explorer performs sign in in your web browser, a redirect to `localhost` is done at the end of the sign in process. Browsers sometimes raise a warning or error that the redirect is being performed with HTTP instead of HTTPS. Some browsers may also try to force the redirect to be performed with HTTPS. If either of these happen, then depending on your browser, you have a variety of options:
- Ignore the warning.
- Add an exception for `localhost`.
- Disable force HTTPS, either globally or just for `localhost`.

If you are not able to do any of those options, then you can also [change where sign in happens](./storage-explorer-sign-in.md#changing-where-sign-in-happens).

### Unable to acquire token, tenant is filtered out

If you see an error message saying that a token cannot be acquired because a tenant is filtered out, that means you are trying to access a resource which is in a tenant you have filtered out. To unfilter the tenant, go to the **Account Panel** and make sure the checkbox for the tenant specified in the error is checked. Refer to the [Managing accounts](./storage-explorer-sign-in.md#managing-accounts) for more information on filtering tenants in Storage Explorer.

### Authentication library failed to start properly

If on startup you see an error message which says that Storage Explorer's authentication library failed to start properly then make sure your install environment meets all [prerequisites](../../vs-azure-tools-storage-manage-with-storage-explorer.md#prerequisites). Not meeting prerequisites is the most likely cause of this error message.

If you believe that your install environment meets all prerequisites, then [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues/new). When you open your issue, make sure to include:
- Your OS.
- What version of Storage Explorer you are trying to use.
- If you checked the prerequisites.
- [Authentication logs](#authentication-logs) from an unsuccessful launch of Storage Explorer. Verbose authentication logging is automatically enabled after this type of error occurs.

### Blank window when using integrated sign-in

If you have chosen to use **Integrated Sign-in** and are seeing a blank sign window, you will likely need to switch to a different sign-in method. Blank sign-in dialog boxes most often occur when an Active Directory Federation Services (ADFS) server prompts Storage Explorer to perform a redirect that is unsupported by Electron.

To change to a different sign-in method by changing the **Sign in with** setting under **Settings** > **Application** > **Sign-in**. For information on the different types of sign-in methods, see [Changing where sign in happens](./storage-explorer-sign-in.md#changing-where-sign-in-happens).

### Reauthentication loop or UPN change

If you're in a reauthentication loop or have changed the UPN of one of your accounts then try these steps:

1. Open Storage Explorer
2. Go to Help > Reset
3. Make sure at least Authentication is checked. You can uncheck other items you do not want to reset.
4. Click the Reset button
5. Restart Storage Explorer and try signing in again.

If you continue to have issues after doing a reset then try these steps:

1. Open Storage Explorer
2. Remove all accounts and then close Storage Explorer.
3. Delete the `.IdentityService` folder from your machine. On Windows, the folder is located at `C:\users\<username>\AppData\Local`. For Mac and Linux, you can find the folder at the root of your user directory.
4. If you're running Mac or Linux, you'll also need to delete the Microsoft.Developer.IdentityService entry from your operating system's keystore. On the Mac, the keystore is the *Gnome Keychain* application. In Linux, the application is typically called _Keyring_, but the name might differ depending on your distribution.
6. Restart Storage Explorer and try signing in again.

### macOS: keychain errors or no sign-in window

The macOS Keychain can sometimes enter a state that causes issues for the Storage Explorer authentication library. To get the Keychain out of this state, follow these steps:

1. Close Storage Explorer.
2. Open Keychain (press Command+Spacebar, type **keychain**, and press Enter).
3. Select the "login" Keychain.
4. Select the padlock icon to lock the Keychain. (The padlock will appear locked when the process is complete. It might take a few seconds, depending on what apps you have open).

    ![Padlock icon](./media/storage-explorer-troubleshooting/unlockingkeychain.png)

5. Open Storage Explorer.
6. You're prompted with a message like "Service hub wants to access the Keychain." Enter your Mac admin account password and select **Always Allow** (or **Allow** if **Always Allow** isn't available).
7. Try to sign in.

### Default browser doesn't open

If your default browser does not open when trying to sign in try all of the following techniques:
- Restart Storage Explorer
- Open your browser manually before starting sign-in
- Try using **Integrated Sign-In**, see [Changing where sign in happens](./storage-explorer-sign-in.md#changing-where-sign-in-happens) for instructions on how to do this.

### Other sign-in issues

If none of the above apply to your sign-in issue or if they fail to resolve you sign-in issue [open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues).

### Missing subscriptions and broken tenants

If you can't retrieve your subscriptions after you successfully sign in, try the following troubleshooting methods:

* Verify that your account has access to the subscriptions you expect. You can verify your access by signing in to the portal for the Azure environment you're trying to use.
* Make sure you've signed in through the correct Azure environment (Azure, Azure China 21Vianet, Azure Germany, Azure US Government, or Custom Environment).
* If you're behind a proxy server, make sure you've configured the Storage Explorer proxy correctly.
* Try removing and re-adding the account.
* If there's a "More information" or "Error details" link, check which error messages are being reported for the tenants that are failing. If you aren't sure how to respond to the error messages, feel free to [open an issue in GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues).

## Can't remove an attached storage account or resource

If you can't remove an attached account or storage resource through the UI, you can manually delete all attached resources by deleting the following folders:

* Windows: `%AppData%/StorageExplorer`
* macOS: `/Users/<your_name>/Library/Application Support/StorageExplorer`
* Linux: `~/.config/StorageExplorer`

> [!NOTE]
> Close Storage Explorer before you delete these folders.

> [!NOTE]
> If you have ever imported any SSL certificates, back up the contents of the `certs` directory. Later, you can use the backup to reimport your SSL certificates.

## Proxy issues

Storage Explorer supports connecting to Azure Storage resources via a proxy server. If you experience any issues connecting to Azure via proxy, here are some suggestions.

> [!NOTE]
> Storage Explorer only supports basic authentication with proxy servers. Other authentication methods, such as NTLM, are not supported.

> [!NOTE]
> Storage Explorer doesn't support proxy auto-config files for configuring proxy settings.

### Verify Storage Explorer proxy settings

The **Application → Proxy → Proxy configuration** setting determines which source Storage Explorer gets the proxy configuration from.

If you select "Use environment variables", make sure to set the `HTTPS_PROXY` or `HTTP_PROXY` environment variables (environment variables are case-sensitive, so be sure to set the correct variables). If these variables are undefined or invalid, Storage Explorer won't use a proxy. Restart Storage Explorer after modifying any environment variables.

If you select "Use app proxy settings", make sure the in-app proxy settings are correct.

### Steps for diagnosing issues

If you're still experiencing issues, try these troubleshooting methods:

1. If you can connect to the internet without using your proxy, verify that Storage Explorer works without proxy settings enabled. If Storage Explorer connects successfully, there may be an issue with your proxy server. Work with your administrator to identify the problems.
2. Verify that other applications that use the proxy server work as expected.
3. Verify that you can connect to the portal for the Azure environment you're trying to use.
4. Verify that you can receive responses from your service endpoints. Enter one of your endpoint URLs into your browser. If you can connect, you should receive an `InvalidQueryParameterValue` or similar XML response.
5. Check whether someone else using Storage Explorer with the same proxy server can connect. If they can, you may have to contact your proxy server admin.

### Tools for diagnosing issues

A networking tool, such as Fiddler, can help you diagnose problems.

1. Configure your networking tool as a proxy server running on the local host. If you have to continue working behind an actual proxy, you may have to configure your networking tool to connect through the proxy.
2. Check the port number used by your networking tool.
3. Configure Storage Explorer proxy settings to use the local host and the networking tool's port number (such as "localhost:8888").
 
When set correctly, your networking tool will log network requests made by Storage Explorer to management and service endpoints.
 
If your networking tool doesn't appear to be logging Storage Explorer traffic, try testing your tool with a different application. For example, enter the endpoint URL for one of your storage resources (such as `https://contoso.blob.core.windows.net/`) in a web browser, and you'll receive a response similar to:

  ![Code sample](./media/storage-explorer-troubleshooting/4022502_en_2.png)

  The response suggests the resource exists, even though you can't access it.

If your networking tool only shows traffic from other applications, you may need to adjust the proxy settings in Storage Explorer. Otherwise, you made need to adjust your tool's settings.

### Contact proxy server admin

If your proxy settings are correct, you may have to contact your proxy server administrator to:

* Make sure your proxy doesn't block traffic to Azure management or resource endpoints.
* Verify the authentication protocol used by your proxy server. Storage Explorer only supports basic authentication protocols. Storage Explorer doesn't support NTLM proxies.

## "Unable to Retrieve Children" error message

If you're connected to Azure through a proxy, verify that your proxy settings are correct.

If the owner of a subscription or account has granted you access to a resource, verify that you have read or list permissions for that resource.

## Connection string doesn't have complete configuration settings

If you receive this error message, it's possible that you don't have the necessary permissions to obtain the keys for your storage account. To confirm that this is the case, go to the portal and locate your storage account. You can do this by right-clicking the node for your storage account and selecting **Open in Portal**. Then, go to the **Access Keys** blade. If you don't have permissions to view keys, you'll see a "You don't have access" message. To work around this issue, you can either obtain the account key from someone else and attach through the name and key, or you can ask someone for a SAS to the storage account and use it to attach the storage account.

If you do see the account keys, file an issue in GitHub so that we can help you resolve the issue.

## Error occurred while adding new connection: TypeError: Cannot read property 'version' of undefined

If you receive this error message when you try to add a custom connection, the connection data that's stored in the local credential manager might be corrupted. To work around this issue, try deleting your corrupted local connections, and then re-add them:

1. Start Storage Explorer. From the menu, go to **Help** > **Toggle Developer Tools**.
2. In the opened window, on the **Application** tab, go to **Local Storage** (left side) > **file://**.
3. Depending on the type of connection you're having an issue with, look for its key and then copy its value into a text editor. The value is an array of your custom connection names, like the following:
    * Storage accounts
        * `StorageExplorer_CustomConnections_Accounts_v1`
    * Blob containers
        * `StorageExplorer_CustomConnections_Blobs_v1`
        * `StorageExplorer_CustomConnections_Blobs_v2`
    * File shares
        * `StorageExplorer_CustomConnections_Files_v1`
    * Queues
        * `StorageExplorer_CustomConnections_Queues_v1`
    * Tables
        * `StorageExplorer_CustomConnections_Tables_v1`
4. After you save your current connection names, set the value in Developer Tools to `[]`.

If you want to preserve the connections that aren't corrupted, you can use the following steps to locate the corrupted connections. If you don't mind losing all existing connections, you can skip these steps and follow the platform-specific instructions to clear your connection data.

1. From a text editor, re-add each connection name to Developer Tools, and then check whether the connection is still working.
2. If a connection is working correctly, it's not corrupted and you can safely leave it there. If a connection isn't working, remove its value from Developer Tools, and record it so that you can add it back later.
3. Repeat until you have examined all your connections.

After going through all your connections, for all connections names that aren't added back, you must clear their corrupted data (if there is any) and add them back by using the standard steps in Storage Explorer:

### [Windows](#tab/Windows)

1. On the **Start** menu, search for **Credential Manager** and open it.
2. Go to **Windows Credentials**.
3. Under **Generic Credentials**, look for entries that have the `<connection_type_key>/<corrupted_connection_name>` key (for example, `StorageExplorer_CustomConnections_Accounts_v1/account1`).
4. Delete these entries and re-add the connections.

### [macOS](#tab/macOS)

1. Open Spotlight (Command+Spacebar) and search for **Keychain access**.
2. Look for entries that have the `<connection_type_key>/<corrupted_connection_name>` key (for example, `StorageExplorer_CustomConnections_Accounts_v1/account1`).
3. Delete these entries and re-add the connections.

### [Linux](#tab/Linux)

Local credential management varies depending on the Linux distribution. If your Linux distribution doesn't provide a built-in GUI tool for local credential management, you can install a third-party tool to manage your local credentials. For example, you can use [Seahorse](https://wiki.gnome.org/Apps/Seahorse/), an open-source GUI tool for managing Linux local credentials.

1. Open your local credential management tool, and find your saved credentials.
2. Look for entries that have the `<connection_type_key>/<corrupted_connection_name>` key (for example, `StorageExplorer_CustomConnections_Accounts_v1/account1`).
3. Delete these entries and re-add the connections.
---

If you still encounter this error after running these steps, or if you want to share what you suspect has corrupted the connections, [open an issue](https://github.com/microsoft/AzureStorageExplorer/issues) on our GitHub page.

## Issues with SAS URL

If you're connecting to a service through a SAS URL and experiencing an error:

* Verify that the URL provides the necessary permissions to read or list resources.
* Verify that the URL has not expired.
* If the SAS URL is based on an access policy, verify that the access policy has not been revoked.

If you accidentally attached by using an invalid SAS URL and now cannot detach, follow these steps:

1. When you're running Storage Explorer, press F12 to open the Developer Tools window.
2. On the **Application** tab, select **Local Storage** > **file://** in the tree on the left.
3. Find the key associated with the service type of the problematic SAS URI. For example, if the bad SAS URI is for a blob container, look for the key named `StorageExplorer_AddStorageServiceSAS_v1_blob`.
4. The value of the key should be a JSON array. Find the object associated with the bad URI, and then delete it.
5. Press Ctrl+R to reload Storage Explorer.

## Linux dependencies

### Snap

Storage Explorer 1.10.0 and later is available as a snap from the Snap Store. The Storage Explorer snap installs all its dependencies automatically, and it's updated when a new version of the snap is available. Installing the Storage Explorer snap is the recommended method of installation.

Storage Explorer requires the use of a password manager, which you might need to connect manually before Storage Explorer will work correctly. You can connect Storage Explorer to your system's password manager by running the following command:

```bash
snap connect storage-explorer:password-manager-service :password-manager-service
```

### .tar.gz File

You can also download the application as a .tar.gz file, but you'll have to install dependencies manually.

Storage Explorer as provided in the .tar.gz download is supported for the following versions of Ubuntu only. Storage Explorer might work on other Linux distributions, but they are not officially supported.

- Ubuntu 20.04 x64
- Ubuntu 18.04 x64
- Ubuntu 16.04 x64

Storage Explorer requires .NET Core to be installed on your system. We recommend .NET Core 2.1, but Storage Explorer will work with 2.2 as well.

> [!NOTE]
> Storage Explorer version 1.7.0 and earlier require .NET Core 2.0. If you have a newer version of .NET Core installed, you'll have to [patch Storage Explorer](#patching-storage-explorer-for-newer-versions-of-net-core). If you're running Storage Explorer 1.8.0 or later, you need at least .NET Core 2.1.

### [Ubuntu 20.04](#tab/2004)

1. Download the Storage Explorer .tar.gz file.
2. Install the [.NET Core Runtime](/dotnet/core/install/linux):
   ```bash
   wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb; \
     sudo dpkg -i packages-microsoft-prod.deb; \
     sudo apt-get update; \
     sudo apt-get install -y apt-transport-https && \
     sudo apt-get update && \
     sudo apt-get install -y dotnet-runtime-2.1
   ```

### [Ubuntu 18.04](#tab/1804)

1. Download the Storage Explorer .tar.gz file.
2. Install the [.NET Core Runtime](/dotnet/core/install/linux):
   ```bash
   wget https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb; \
     sudo dpkg -i packages-microsoft-prod.deb; \
     sudo apt-get update; \
     sudo apt-get install -y apt-transport-https && \
     sudo apt-get update && \
     sudo apt-get install -y dotnet-runtime-2.1
   ```

### [Ubuntu 16.04](#tab/1604)

1. Download the Storage Explorer .tar.gz file.
2. Install the [.NET Core Runtime](/dotnet/core/install/linux):
   ```bash
   wget https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb; \
     sudo dpkg -i packages-microsoft-prod.deb; \
     sudo apt-get update; \
     sudo apt-get install -y apt-transport-https && \
     sudo apt-get update && \
     sudo apt-get install -y dotnet-runtime-2.1
   ```
---

Many libraries needed by Storage Explorer come preinstalled with Canonical's standard installations of Ubuntu. Custom environments may be missing some of these libraries. If you have issues launching Storage Explorer, we recommend making sure the following packages are installed on your system:

- iproute2
- libasound2
- libatm1
- libgconf2-4
- libnspr4
- libnss3
- libpulse0
- libsecret-1-0
- libx11-xcb1
- libxss1
- libxtables11
- libxtst6
- xdg-utils

### Patching Storage Explorer for newer versions of .NET Core

For Storage Explorer 1.7.0 or earlier, you might have to patch the version of .NET Core used by Storage Explorer:

1. Download version 1.5.43 of StreamJsonRpc [from NuGet](https://www.nuget.org/packages/StreamJsonRpc/1.5.43). Look for the "Download package" link on the right side of the page.
2. After you download the package, change its file extension from `.nupkg` to `.zip`.
3. Unzip the package.
4. Open the `streamjsonrpc.1.5.43/lib/netstandard1.1/` folder.
5. Copy `StreamJsonRpc.dll` to the following locations in the Storage Explorer folder:
   * `StorageExplorer/resources/app/ServiceHub/Services/Microsoft.Developer.IdentityService/`
   * `StorageExplorer/resources/app/ServiceHub/Hosts/ServiceHub.Host.Core.CLR.x64/`

## "Open In Explorer" from the Azure portal doesn't work

If the **Open In Explorer** button on the Azure portal doesn't work, make sure you're using a compatible browser. The following browsers have been tested for compatibility:
* Microsoft Edge
* Mozilla Firefox
* Google Chrome
* Microsoft Internet Explorer

## Gathering logs

When you report an issue to GitHub, you may be asked to gather certain logs to help diagnose your issue.

### Storage Explorer logs

Starting with version 1.16.0, Storage Explorer logs various things to its own application logs. You can easily get to these logs by clicking on Help > Open Logs Directory. By default, Storage Explorer logs at a low level of verbosity. To change the verbosity level, add an environment variable with the name of `STG_EX_LOG_LEVEL`, and any of the following values:
- `silent`
- `critical`
- `error`
- `warning`
- `info` (default level)
- `verbose`
- `debug`

Logs are split into folders for each session of Storage Explorer that you run. For whatever log files you need to share, it is recommended to place them in a zip archive, with files from different sessions in different folders.

### Authentication logs

For issues related to sign-in or Storage Explorer's authentication library, you will most likely need to gather authentication logs. Authentication logs are stored at:
- Windows: `C:\Users\<your username>\AppData\Local\Temp\servicehub\logs`
- macOS and Linux `~/.ServiceHub/logs`

Generally, you can follow these steps to gather the logs:

1. Go to **Settings (gear icon on the left)** > **Application** > **Sign-in** > check **Verbose Authentication Logging**. If Storage Explorer is failing to launch due to an issue with its authentication library, this will be done for you.
2. Close Storage Explorer.
1. Optional/recommended: clear out existing logs from the `logs` folder. Doing this will reduce the amount of information you have to send us.
4. Open Storage Explorer and reproduce your issue
5. Close Storage Explorer
6. Zip the contents of the `logs` folder.

### AzCopy logs

If you are having trouble transferring data, you may need to get the AzCopy logs. AzCopy logs can be found easily via two different methods:
- For failed transfers still in the Activity Log, click on "Go to AzCopy Log File"
- For transfers that failed in the past, go to the AzCopy logs folder. This folder can be found at:
  - Windows: `C:\Users\<your username>\.azcopy`
  - macOS and Linux `~/.azcopy

### Network logs

For some issues you will need to provide logs of the network calls made by Storage Explorer. On Windows, you can do this by using Fiddler.

> [!NOTE]
> Fiddler traces may contain passwords you entered/sent in your browser during the gathering of the trace. Make sure to read the instructions on how to sanitize a Fiddler trace. Do not upload Fiddler traces to GitHub. You will be told where you can securely send your Fiddler trace.

Part 1: Install and Configure Fiddler

1. Install Fiddler
2. Start Fiddler
3. Go to Tools > Options
4. Click on the HTTPS tab
5. Make sure Capture  CONNECTs and Decrypt HTTPS traffic are checked
6. Click on the Actions button
7. Choose "Trust Root Certificate" and then "Yes" in the next dialog
8. Click on the Actions button again
9. Choose “Export Root Certificate to Desktop”
10. Go to your desktop
11. Find the FiddlerRoot.cer file
12. Double-click to open
13. Go to the "Details" tab
14. Click "Copy to File…"
15. In the export wizard choose the following options
    - Base-64 encoded X.509
    - For file name, Browse… to C:\Users\<your user dir>\AppData\Roaming\StorageExplorer\certs, and then you can save it as any file name
16. Close the certificate window
17. Start Storage Explorer
18. Go to Edit > Configure Proxy
19. In the dialog, choose "Use app proxy settings", and set the URL to http://localhost and the port to 8888
20. Click Ok
21. Restart Storage Explorer
22. You should start seeing network calls from a `storageexplorer:` process show up in Fiddler

Part 2: Reproduce the issue
1. Close all apps other than Fiddler
2. Clear the Fiddler log (X icon in the top left, near the View menu)
3. Optional/recommended: let Fiddler set for few minutes, if you see network calls appear, right-click on them and choose 'Filter Now' > 'Hide <process name>'
4. Start Storage Explorer
5. Reproduce the issue
6. Click File > Save > All Sessions…, save somewhere you won't forget
7. Close Fiddler and Storage Explorer

Part 3: Sanitize the Fiddler trace
1. Double-click on the fiddler trace (.saz file)
2. Press `ctrl`+`f`
3. In the dialog that appears, make sure the following options are set: Search = Requests and responses, Examine = Headers and bodies
4. Search for any passwords you used while collecting the fiddler trace, any entries that are highlighted, right-click and choose Remove > Selected sessions
5. If you definitely entered passwords into your browser while collecting the trace but you don't find any entries when using ctrl+f and you don't want to change your passwords/the passwords you used are used for other accounts, then feel free to just skip sending us the .saz file. Better to be safe than sorry. :)
6. Save the trace again with a new name
7. Optional: delete the original trace

## Next steps

If none of these solutions work for you, you can:
- Create a support ticket
- [Open an issue on GitHub](https://github.com/Microsoft/AzureStorageExplorer/issues). You can also do this by selecting the **Report issue to GitHub** button in the lower-left corner.

![Feedback](./media/storage-explorer-troubleshooting/feedback-button.PNG)