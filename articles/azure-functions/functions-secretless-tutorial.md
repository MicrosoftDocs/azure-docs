---
title: How to configure Azure Functions with identity based connections
description: Article that shows you how to use identity based connections with Azure Functions instead of connection strings
ms.topic: conceptual
ms.date: 3/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Creating a Function App with Identity Based Connections

This article shows you how to configure a secretless function app using identity based connections instead of connection strings. To learn more about identity based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

In this tutorial, you'll:
- create a function app without Azure Files
- enable managed identity on the function app
- Deploy a function using run from package
- add a Service Bus queue trigger

## Create a Function App without Azure Files

You'll create a function app and configure it without Azure Files because Azure Files currently doesn't support managed identity for SMB file shares. For more information on apps without Azure Files, refer [here](./storage-considerations.md#create-an-app-without-azure-files) 

> [!Note]
> Do not create the Function App until you have edited the ARM template as specified by the steps in this section.

1. On the Azure portal menu or the **Home** page, select **Create a resource**.

1. On the **New** page, select **Compute** > **Function App**.

1. On the **Basics** page, use the following table to configure the function app settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Subscription** | Your subscription | Subscription under which this new function app is created. |
    | **[Resource Group](../azure-resource-manager/management/overview.md)** |  myResourceGroup | Name for the new resource group where you'll create your function app. |
    | **Function App name** | Globally unique name | Name that identifies your new function app. Valid characters are `a-z` (case insensitive), `0-9`, and `-`.  |
    |**Publish**| Code | Choose to publish code files or a Docker container. |
    | **Runtime stack** | .NET | This tutorial uses .NET. |
    |**Region**| Preferred region | Choose a [region](https://azure.microsoft.com/regions/) near you or near other services that your functions access. |

1. Select **Next: Hosting**. On the **Hosting** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Storage account](../storage/common/storage-account-create.md)** |  Globally unique name |  Create a storage account used by your function app. Storage account names must be between 3 and 24 characters long. They may contain numbers and lowercase letters only. You can also use an existing account, which must meet the [storage account requirements](./storage-considerations.md#storage-account-requirements). |
    |**Operating system**| Windows | This tutorial uses Windows. |
    | **[Plan](./functions-scale.md)** | Consumption (Serverless) | Hosting plan that defines how resources are allocated to your function app. |

1. Select **Next: Monitoring**. On the **Monitoring** page, enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **[Application Insights](./functions-monitoring.md)** | Default | Create an Application Insights resource of the same app name in the nearest supported region. Expand this setting if you need to change the **New resource name** or store your data in a different **Location** in an [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/). |

1. Select **Review + create**.

1. Do not create your Function App. Select **Download a template for automation** to the right of the **Next** button.

1. Select **Deploy**.
    :::image type="content" source="./media/functions-secretless-tutorial/1-function-create-deploy.png" alt-text="Screenshot of where to find the deploy button for creating a Function.":::

1. Select **Edit template**.
    :::image type="content" source="./media/functions-secretless-tutorial/2-function-edit-template.png" alt-text="Screenshot of how to edit a template for Function creation.":::

1. In the editor, remove the WEBSITE_CONTENTAZUREFILECONNECTIONSTRING and WEBSITE_CONTENTSHARE app settings, lines 82-89 in the below image.
    :::image type="content" source="./media/functions-secretless-tutorial/3-function-remove-app-settings.png" alt-text="Screenshot of which settings to remove for Azure Files secretless.":::

1. Select **Save** to save the updated ARM template without Azure Files.

1. On the **Review + create** page, verify your configuration. You may need to update some settings such as the **Resource Group**. Then, select **Create** to provision and deploy the function app.

1. If you access your function app once created, you will get a warning about Storage not being configured properly. This is expected as you have removed Azure Files. Later in this tutorial, you will setup run-from-package which will remove the warning.

1. Congratulations! You've successfully created your function app without Azure Files.

## Enable Managed Identity

To make your function app secretless, you will need to enable managed identity. This tutorial uses the system assigned identity. To learn more about managed identities refer [here](../app-service/overview-managed-identity.md). 

1. In your function app, in the left menu, select **Identity**.
    :::image type="content" source="./media/functions-secretless-tutorial/4-add-system-assigned-id.png" alt-text="Screenshot how to add a system assigned identity.":::

1. Select the **System assigned**.

1. Switch the **Status** to **On**, and select **Save**.

1. Next, you will add role assignments. This function app needs to be able to access blob content in its storage account without a key.

1. Select **Azure role assignments** to open the **Azure role assignments** page. 

1. Select **Azure role assignment (Preview)** to open the **Add role assignment** blade.
    :::image type="content" source="./media/functions-secretless-tutorial/5-role-assignment.png" alt-text="Screenshot of how to role assignments for storage":::

1. Enter the following settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Scope** |  Storage |  Scope is a set of resources that the role assignment applies to. Scope has levels that are inherited at lower levels. For example, if you select a subscription scope, the role assignment applies to all resource groups and resources in the subscription. |
    |**Subscription**| Your subscription | Subscription under which this new function app is created. |
    |**Resource**| Your storage account | The storage account for your function app. |
    | **Role** | Storage Blob Data Owner | A role is a collection of permissions. Grants full access to manage all resources, including the ability to assign roles in Azure RBAC. |

1. Select **Save**.

1. Congratulations! You have created a System assigned Storage Blob Data Owner role! This will allow you to use managed identity to pull packages from the blob account, so when you configure run-from-package, you won't need to use a SAS. 

## Deploy a function using Run From Package

You'll now deploy a simple timer triggered function to confirm things are configured correctly so far to not require secrets in AzureWebJobsStorage. 

1. Create a timer triggered function app in Visual Studio. For steps, follow the steps for creating an HTTP triggered function app in the [Visual Studio quickstart](./functions-create-your-first-function-visual-studio.md#create-a-function-app-project), but create a timer trigger instead.

1. In order to publish a package to the blob, you'll need to manually add the package.
I right click the project and select publish, but VS doesn't know how to publish a package to blob. I'll need to do that manually. So I select the folder profile and hit publish:

1. Right click the project and select **Publish**. 
    :::image type="content" source="./media/functions-secretless-tutorial/6-publish-app.png" alt-text="Screenshot of how to open the publish an app view in Visual Studio.":::
 
1. Select **Folder** for the target, and select **Next**.

1. On the new window, select **Finish**.

1. Select **Publish**.
    :::image type="content" source="./media/functions-secretless-tutorial/7-publish-button.png" alt-text="Screenshot of how to Publish to files.":::

1. In your directory, zip the published output **bin** folder, **host** file, and **Function** (Timer) folder.

1. In the portal view for your storage account, select **Containers** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/8-new-store-container.png" alt-text="Screenshot of how to create a new storage container.":::

1. Select to create a new **Container**.

1. In the **New container** blade, provide a name, and select **Create**.

1. Select the container you just created.

1. Now, upload your zipped file. Select **Upload**.
    :::image type="content" source="./media/functions-secretless-tutorial/9-upload-zip.png" alt-text="Screenshot of how to go to upload a package.":::

1. In the **Upload blob** blade, select your zipped file, and select **Upload**.

1. Once uploaded, select your uploaded blob zip file.
    :::image type="content" source="./media/functions-secretless-tutorial/10-copy-url.png" alt-text="Screenshot of how to get the zipped blob url.":::

1. Copy the blob url for your published zip file. 

1. In your function app, select **Configurations** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/11-web-run-from-package.png" alt-text="Screenshot of how to add the run from package app setting.":::

1. Select **New application setting**.

1. Enter **WEBSITE_RUN_FROM_PACKAGE** for the Name, and paste your blob url for the value field.

1. Select **OK** and **Save**.

1. Test your app setup. In your function app, select **Functions** from the left blade.
    :::image type="content" source="./media/functions-secretless-tutorial/12-timer-test.png" alt-text="Screenshot of how to open the test a timer trigger view.":::

1. Select **Timer**

1. In the left blade, go to **Code+Test**.
    :::image type="content" source="./media/functions-secretless-tutorial/13-test-run.png" alt-text="Screenshot of how to test the timer trigger.":::

1. Select **Test/Run**, and select **Run** in the blade that opens.

1. You should see a similar message to the last image. Congratulations! You've successfully run your timer trigger.

## Step 4: Use Managed Identity for AzureWebJobsStorage

The next step is to switch AzureWebJobsStorage to be secretless. This should already work because the function app has the Storage Blob Data Owner role, and you will just need to update the app setting. 

1. In your function app, in the left menu, select **Configuration**.
    :::image type="content" source="./media/functions-secretless-tutorial/14-update-azurewebjobsstorage.png" alt-text="Screenshot of how to update the AzureWebJobsStorage app setting.":::

1. Select the **AzureWebJobsStorage** app setting, and configure it with the below settings.

    | Setting      | Suggested value  | Description |
    | ------------ | ---------------- | ----------- |
    | **Name** |  AzureWebJobsStorage__accountName | Update the name from **AzureWebJobsStorage** to use the identity instead of secrets. |
    |**Value**| Your account name | Update the name from the connection string to just your **AccountName** to use the identity instead of secrets. Ex. `DefaultEndpointsProtocol=https;AccountName=identityappstore;AccountKey=...` would become `identityappstore`|

1. Follow the previous steps for testing your timer trigger to make sure everything is still working correctly.

1. Congratulations! You've successfully removed all secrets in your function app by configuring it without Azure Files and using managed identity to load the application content from blob storage using WEBSITE_RUN_FROM_PACKAGE.

## Step 5 Update the extension bundle 

**This step applies only to JavaScript, Python, PowerShell and Java.**

Some of the next steps cover using identity based connections for triggers. For .NET users, this involves referencing the new NuGet packages (steps are outlined below). For JavaScript, Python, PowerShell and Java, you don't manage NuGet packages, instead you use an extension bundle. To use identity based connections, you'll need to use the preview extension bundle. To do this, edit your host.json in Visual Studio and configure the extension bundle as follows:

```json
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[3.*, 4.0.0)"
  }
```

## Optional Step A: Use Managed Identity to access Key Vault

There's one more key-like setting in your Function App, and that’s your App Insights connection string. This is not technically a secret as it contains the instrumentation key, which is not always protectable. However, you can configure this setting using Key Vault and use managed identity to access it.

1. Create a Key Vault, and add a secret. I call the secret "AppInsights" and paste in the connection string for the value.

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644364950.png)

I then switch the Key Vault over to use Azure role-based access control:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644413549.png)

I then add a role assignment in my Function App to give it Key Vault Secrets User:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644434000.png)

Now I can use a Key Vault reference in my application settings. Documentation for that is [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references).

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644494384.png)

I switch over to App Insights, open live metrics, and confirm that my Key Vault reference is working and my data is still flowing. Everything seems to be working fine:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644527788.png)

The Function App is now fully secretless, but it currently only has a timer trigger i.e. its not being triggered by an external source. That’s what I'll cover next. But first, a screenshot of the appsettings in my app with nothing redacted, because there's no secrets:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644561613.png)

## Optional Step B: Add a Storage Queue Trigger

Add a storage queue trigger. A prerequisite of this tutorial is having existing queue data, so I'm going to create a new storage account to represent that. I then go into the role assignments for the function app and add the Storage Queue Data Contributor role for this new storage account:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644797808.png)

Next, reference the new extensions. For .NET, see the next paragraph. For other languages see the [extension bundle section](#step-5-update-the-extension-bundle) above.

I make sure to update my storage extension to 5.x. This is the new storage extension for functions that uses the newest version of the Azure Storage SDK for .NET. There was a blog post about that here. At the time of writing, the newest version of the library is 5.0.0-beta4:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644809684.png)


This queue trigger uses a connection called "QueueConnection", so I need to configure the function app with the account name, similar to what I did above for AzureWebJobsStorage:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644829790.png)

I'm also using an environment variable for the name of the queue within the account (InputQueueName in the above screenshot), but its just a convenience and not necessary.

For every connection that is used as a trigger, I must also add the credential setting that specifies that managed identity is used. So I add a `QueueConnection_credential` setting with value `managedIdentity`.

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624658524131.png)

A future update to Azure Functions will remove this requirement when using system assigned identities. Once this update is live, simply setting __accountName would be enough.

My function app has been updated to have the necessary role to access the queue using managed identity, and its been configured to know what account to access, and it has a queue triggered function that uses the new extension that has support for managed identity. The only remaining step is to publish the changes. I repeat the folder publishing step, zip the content, upload it to storage calling it "queue.zip" and update my run from package URL:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644849689.png)

Now I go to the queue in the portal, and I add a message:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644858600.png)

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644866344.png)

I wait a bit and then refresh and the message has been read:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644879341.png)

## Optional Step C: Add a Service Bus Queue Trigger

Again I start with role assignments, adding the function app as a Azure Service Bus Data Owner:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644967309.png)

I have to configure the function app with the details of the namespace. My connection is going to be called ServiceBusConnection so I add a ServiceBusConnection__fullyQualifiedNamespace setting:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645004512.png)

For every connection that is used as a trigger, I must also add the credential setting that specifies that managed identity is used. So I add a `ServiceBusConnection_credential` setting with value `managedIdentity`.

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624659002007.png)

I add a service bus queue triggered function, again making sure to use the newest extension which is Microsoft.Azure.WebJobs.Extensions.ServiceBus version 5.0.0-beta4 at time of writing:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645067952.png)

I go through similar publish steps as before. Here's my appsettings now:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645077874.png)

## Optional Step D: Use Managed Identity for local development

To test the service bus trigger I added above, I need to drop a message in the service bus queue, but the portal won't let me do that. There are plenty of other ways to write a message to a service bus queue, but this seems like a good opportunity to try using managed identity locally. First I go into VS and make sure that its configured to use my account:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645133535.png)

Next I go into the portal and give myself the Azure Service Bus Data Owner role - the same as what I did for my function app above:
![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645150828.png)

Now I make a separate function app that is going to host a HTTP triggered function that uses an output binding to write to the queue. Again, making sure to use the newest extension package:
![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645164664.png)

I modify my local.settings.json so that my local environment knows which namespace and queue the message has to be written to:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645198975.png)

I then set this function app as my startup project and hit F5. It outputs the URL for my function, and I call it using my browser:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645244319.png)

Without configuring any connection string, my local debug session is able to write the message to the queue, and then I check app insights and I see my function ran and picked up the message:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645272006.png)

This concludes the walkthrough.

## Notes on Event Hubs and Blob Trigger

You can follow similar steps for Event Hubs and Blob trigger. Event Hubs would follow the same patterns as Service Bus, while blob is a little more complicated. The functions host uses queues internally to run the blob trigger, so you would need to make sure that the function app has both blob and queue role assignments, for both the account that is configured for AzureWebJobsStorage, and the account that contains the blobs you're triggering on.

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus. You secured all of these resources behind private endpoints. 

Use the following links to learn more Azure Functions networking options and private endpoints:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)

- [Identity based connections in Azure Functions](./azure-functions/functions-reference.md#configure-an-identity-based-connection)

- [Connecting to host storage with an Identity](./azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity)

- [Creating a Function App without Azure Files](./azure-functions/storage-considerations.md#create-an-app-without-azure-files)

- [Run Azure Functions from a package file](./azure-functions/run-functions-from-deployment-package.md)

- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)

- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)

- [Functions documentation for local development](./azure-functions/functions-reference#local-development)

- [Azure SDK blog post about the new extensions](https://devblogs.microsoft.com/azure-sdk/introducing-the-new-azure-function-extension-libraries-beta/)

- [GitHub issue were this scenario is discussed](https://github.com/Azure/azure-functions-host/issues/6423)