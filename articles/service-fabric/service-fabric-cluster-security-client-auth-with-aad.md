
<properties
   pageTitle="Service Fabric cluster security: client authentication with Azure Active Directory | Microsoft Azure"
   description="This article describes how to create a Service Fabric cluster using Azure Active Directory (AAD) for client authentication"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/13/2016"
   ms.author="seanmck"/>

# Create a Service Fabric cluster using Azure Active Directory for client authentication

You can secure access to the management endpoints of a Service Fabric cluster using Azure Active Directory (AAD). This article covers how to create the necessary AAD artifacts, how to populate them during cluster creation, and how to connect to those clusters afterwards.

## Model a Service Fabric cluster in AAD

AAD enables organizations (known as tenants) to manage user access to applications, which are divided into applications with a web-based login UI and applications with a native client experience. In this document, we will assume that you have already created a tenant. If not, start by reading [How to get an Azure Active Directory tenant](../active-directory/active-directory-howto-tenant.md).

Service Fabric clusters offer a variety of entry points to their management functionality, including the web-based [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) and [Visual Studio](service-fabric-manage-application-in-visual-studio.md). As a result, you will create two AAD applications to control access to the cluster, one web application and one native application.

To simplify some of the steps involved in configuring AAD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

>[AZURE.NOTE] You must perform these steps *before* creating the cluster so in cases where the scripts expect cluster names and endpoints, these should be the planned values, not ones which you have already created.

1. [Download the scripts][sf-aad-ps-script-download] to your computer.

2. Right click on the zip file, choose **Properties**, then check the **Unblock** checkbox and apply.

3. Extract the zip file.

4. Run `SetupApplications.ps1`, providing the TenantId, ClusterName, and WebApplicationReplyUrl as parameters. For example:

    ```powershell
    .\SetupApplications.ps1 -TenantId '690ec069-8200-4068-9d01-5aaf188e557a' -ClusterName 'mycluster' -WebApplicationReplyUrl 'https://mycluster.westus.cloudapp.azure.com:19080/Explorer/index.html'
    ```

    You can find your **TenantId** by looking at the URL for the tenant in the Azure classic portal. The GUID embedded in that URL is the TenantId. For example:

    https://<i></i>manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/**690ec069-8200-4068-9d01-5aaf188e557a**/users

    The **ClusterName** will be used to prefix the AAD applications created by the script. It does not need to match the actual cluster name exactly as it is only intended to make it easier for you to map AAD artifacts to the Service Fabric cluster that they're being used with.

    The **WebApplicationReplyUrl** is the default endpoint that AAD will return your users to after completing the sign-in process. You should set this to the Service Fabric Explorer endpoint for your cluster, which by default is:

    https://&lt;cluster_domain&gt;:19080/Explorer

    You will be prompted to sign into an account which has administrative privileges for the AAD tenant. Once you do, the script will proceed to create the web and native applications to represent your Service Fabric cluster. If you look at the tenant's applications in the [Azure classic portal][azure-classic-portal], you should see two new entries:

    - *ClusterName*\_Cluster
    - *ClusterName*\_Client

    The script will print the Json required by the Azure Resource Manager (ARM) template when you create the cluster in the next section so keep the PowerShell window open.

    ![The output of the SetupApplication script includes the Json required by the ARM template][setupapp-script-output]

## Create the cluster

Now that you have created the AAD applications, you can create the Service Fabric cluster. At this time, the Azure portal does not support configuring AAD authentication for Service Fabric clusters so you will need to do it using an ARM template in PowerShell or Visual Studio.

Note that AAD is only used for client authentication to the cluster. To create a secure cluster, you must also provide a certificate, which will be used to secure communication between the nodes in the cluster and to provide server authentication for the cluster's management endpoints. You can find an [ARM template for a secure cluster in the Azure quickstart gallery][secure-cluster-arm-template] or you can follow the instructions provided in the readme of the [Service Fabric resource group project in Visual Studio](service-fabric-cluster-creation-via-visual-studio.md).

Add the ARM template snippet output from the `SetupApplication` script
as a peer to fabricSettings, managementEndpoint, etc. If you closed the window, the snippet is also shown below:

```json
  "azureActiveDirectory": {
    "tenantId": "<your_tenant_id>",
    "clusterApplication": "<your_cluster_application_client_id>",
    "clientApplication": "<your_native_application_client_id>"
  }
```

The clusterApplication refers to the web application created in the previous section. You can find its ID in the output of the SetupApplication script, where it is referred to as `WebAppId`. The clientApplication refers to the native application and its client ID is available in the SetupApplication output as NativeClientAppId.

## Assign users to roles

Once you have created the applications to represent your cluster, you will need to assign your users to the roles supported by Service Fabric: read-only and admin. You can do this using the [Azure classic portal][azure-classic-portal].

1. Navigate to your tenant and choose Applications.
2. Choose the web application, which will have a name like `myTestCluster_Cluster`.
3. Click the Users tab.
4. Choose a user to assign and click the **Assign** button at the bottom of the screen.

    ![Assign users to roles button][assign-users-to-roles-button]

5. Select the role to assign to the user.

    ![Assign users to roles][assign-users-to-roles-dialog]

>[AZURE.NOTE] For more information about roles in Service Fabric, see [Role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).

## Connecting to the cluster

When you navigate to Service Fabric Explorer on an AAD-enabled cluster, you will be automatically redirected to a secure login page.

To connect from a native client like Windows PowerShell or Visual Studio, you will need to indicate AAD as your sign-in mechanism and then provide a server cert thumbprint, which serves to validate the identity of the endpoint. The details for these two entry points are shown below.

### Connecting from Visual Studio

In Visual Studio, you can modify the publish profile to add the necessary attributes as shown below:

```xml
<ClusterConnectionParameters     
    ConnectionEndpoint="<your_cluster_endpoint>:19000"  
    AzureActiveDirectory="true"
    ServerCertThumbprint="<your_cert_thumbprint>"
    />
```

When you publish to the cluster, Visual Studio will pop a login window where you can authenticate to the cluster.

![AAD login window during Visual Studio publish][vs-publish-aad-login]

### Connecting from Windows PowerShell

In PowerShell, you can provide the necessary parameters to the Connect-ServiceFabricCluster cmdlet as shown below:

```PowerShell
Connect-ServiceFabricCluster -AzureActiveDirectory -ConnectionEndpoint <cluster_endpoint>:19000 -ServerCertThumbprint <server_cert_thumbprint>
```

As in Visual Studio, PowerShell will present a secure login window for authentication.

>[AZURE.NOTE] By default, the Service Fabric TCP gateway used by PowerShell and Visual Studio listens on port 19000. If you have configured a different port, you should use that instead when specifying the connection endpoint.

## Known issues

### Native client authentication error due to mismatched reply address

When authenticating from a native client, such as Visual Studio or PowerShell, you may see an error message like this:

*Reply address http://localhost/ does not match reply address configured for application &lt;cluster client application GUID&gt;*

To work around this, add **http://<i></i>localhost** as a redirect URI to the cluster client application definition in AAD, in addition to the address 'urn:ietf:wg:oauth:2.0:oob' that is already there.

## Next steps

- Read more about [Service Fabric cluster security](service-fabric-cluster-security.md)
- Learn how to [publish to a remote cluster using Visual Studio](service-fabric-publish-app-remote-cluster.md)

<!-- Links -->
[sf-aad-ps-script-download]:http://servicefabricsdkstorage.blob.core.windows.net/publicrelease/MicrosoftAzureServiceFabric-AADHelpers.zip
[secure-cluster-arm-template]:https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype-wad
[aad-graph-api-docs]:https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/api-catalog
[azure-classic-portal]: https://manage.windowsazure.com

<!-- Images -->
[assign-users-to-roles-button]: ./media/service-fabric-cluster-security-client-auth-with-aad/assign-users-to-roles-button.png
[assign-users-to-roles-dialog]: ./media/service-fabric-cluster-security-client-auth-with-aad/assign-users-to-roles.png
[setupapp-script-output]: ./media/service-fabric-cluster-security-client-auth-with-aad/setupapp-script-arm-json-output.png
[vs-publish-aad-login]: ./media/service-fabric-cluster-security-client-auth-with-aad/vs-login-prompt.png
