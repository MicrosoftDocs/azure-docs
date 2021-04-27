---
title: Role instance startup failure in Azure Cloud Services (extended support)
description: Troubleshoot role instance startup failure in Azure Cloud Services (extended support).
ms.topic: article
ms.service: cloud-services-extended-support
author: surbhijain
ms.author: surbhijain
ms.reviewer: gachadw
ms.date: 04/01/2021
ms.custom: 
---

# Troubleshoot Azure Cloud Services (extended support) roles that fail to start

Here are some common problems and solutions related to Azure Cloud Services (extended support) roles that fail to start.

## Cloud service operation fails with RoleInstanceStartupTimeoutError

One or more of your role instances in Azure Cloud Services (extended support) might be slow to start, or they might be recycling and the role instance fails. The role application error `RoleInstanceStartupTimeoutError` appears.

The role application contains two parts that might cause role recycling: *Startup Tasks* and *Role code (Implementation of RoleEntryPoint)*. 

If the role stops, the platform as a service (PaaS) agent restarts the role.

You can get the current state and details for a role instance to diagnose errors by using PowerShell or the Azure portal:

* **PowerShell**: Use the [Get-AzCloudServiceRoleInstanceView](/powershell/module/az.cloudservice/get-azcloudserviceroleinstanceview) cmdlet to get information about the runtime state of the role instance:

    ```powershell
    Get-AzCloudServiceRoleInstanceView -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "WebRole1_IN_0"
     
    Statuses           PlatformFaultDomain PlatformUpdateDomain
    --------           ------------------- --------------------
    {RoleStateStarting} 0                   0
    ```

* **Azure portal**: In the portal, go to the cloud service instance. To view status details, select **Roles and Instances**, and then select the role instance.

  :::image type="content" source="media/role-startup-failure-portal.png" alt-text="Screenshot that shows a role startup failure in the Azure portal.":::

## Missing DLLs or dependencies

Unresponsive roles and roles that cycle between states might be caused by missing DLLs or assemblies.

Here are some symptoms of missing DLLs or assemblies:

* Your role instance cycles through the states **Initializing**, **Busy**, and **Stopping**.
* Your role instance has moved to the **Ready** state, but if you go to your web application, the page isn't visible.


A website that's deployed in a web role and missing a DLL might display this server runtime error:

  :::image type="content" source="media/role-startup-failure-runtime-error.png" alt-text="Screenshot that shows a runtime error after a role startup failure.":::

### Resolve missing DLLs and assemblies

To resolve errors of missing DLLs and assemblies:

1. In Visual Studio, open the solution.
2. In Solution Explorer, open the *References* folder.
3. Select the assembly that's identified in the error.
4. In **Properties**, set the **Copy Local** property to **True**.
5. Redeploy the cloud service.

After you verify that errors no longer appear, redeploy the service. When you set up the deployment, don't select the **Enable IntelliTrace for .NET 4 roles** checkbox.

## Diagnose role instance errors

Choose from the following options to diagnose issues with role instances.

### Turn off custom errors

To view complete error information, in the *web.config* file for the web role, set the custom error mode to `off`, and then redeploy the service:

1. In Visual Studio, open the solution.
2. In Solution Explorer, open the *web.config* file.
3. In the `system.web` section, add the following code:

   ```xml
   <customErrors mode="Off" />
   ```

4. Save the file.
5. Repackage and redeploy the service.

When the service is redeployed, an error message includes the name of missing assemblies or DLLs.

### Use Remote Desktop

Use Remote Desktop to access the role and view complete error information:

1. [Add the Remote Desktop extension for Azure Cloud Services (extended support)](enable-rdp.md).
2. In the Azure portal, when the cloud service instance shows a **Ready** status, use Remote Desktop to sign in to the cloud service. For more information, see [Connect to role instances by using Remote Desktop](enable-rdp.md#connect-to-role-instances-with-remote-desktop-enabled).
3. Sign in to the virtual machine by using the credentials that you used to set up Remote Desktop.
4. Open a Command Prompt window.
5. At the command prompt, enter **ipconfig**. Note the returned value for the IPv4 address.
6. Open Microsoft Internet Explorer.
7. In the address bar, enter the IPv4 address followed by a slash and the name of the web application default file. For example, `http://<IPv4 address>/default.aspx`.

If you go to the website now, you'll see error messages that contain more information. Here's an example:

:::image type="content" source="media/role-startup-failure-error-message.png" alt-text="Screenshot that shows an example of an error message.":::
  
### Use the compute emulator

You can use the Azure compute emulator to diagnose and troubleshoot issues of missing dependencies and *web.config* errors. When you use this method to diagnose issues, for best results, use a computer or virtual machine that has a clean installation of Windows.

To diagnose issues by using the Azure compute emulator:

1. Install the [Azure SDK](https://azure.microsoft.com/downloads/).
2. On the development computer, build the cloud service project.
3. In File Explorer, in the cloud service project, go to the *bin\debug* folder.
4. Copy the *.csx* folder and the *.cscfg* file to the computer that you're using to debug issues.
5. On the clean machine, open an Azure SDK Command Prompt window.
6. At the command prompt, enter **csrun.exe /devstore:start**.
7. Then, enter **run csrun \<path to .csx folder\> \<path to .cscfg file\> /launchBrowser**.
8. When the role starts, Internet Explorer displays detailed error information.

If more diagnosis is required, you can use standard Windows troubleshooting tools.

### Use IntelliTrace

For worker and web roles that use .NET Framework 4, you can use [IntelliTrace](/visualstudio/debugger/intellitrace). IntelliTrace is available in Visual Studio Enterprise.

To deploy your cloud service with IntelliTrace turned on:

1. Confirm that Azure SDK 1.3 or later is installed.
2. In Visual Studio, deploy the solution. When you set up the deployment, select the **Enable IntelliTrace for .NET 4 roles** checkbox.
3. After the role instance starts, open Server Explorer.
4. Expand the **Azure\Cloud Services** node.
5. Expand the deployment to list role instances. Right-click a role instance.
6. Select **View IntelliTrace logs**.
7. In **IntelliTrace Summary**, go to  **Exception Data**.
8. Expand **Exception Data** and look for a `System.IO.FileNotFoundException` error:

   :::image type="content" source="media/role-startup-failure-exception-data.png" alt-text="Screenshot of exception data for a role startup failure." lightbox="media/role-startup-failure-exception-data.png":::

## Next steps

- Learn how to [troubleshoot cloud service role issues by using Azure PaaS computer diagnostics data](https://docs.microsoft.com/archive/blogs/kwill/windows-azure-paas-compute-diagnostics-data).
