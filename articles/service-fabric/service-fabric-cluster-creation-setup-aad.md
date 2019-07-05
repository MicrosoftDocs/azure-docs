---
title: Set up Azure Active Directory for Service Fabric client authentication | Microsoft Docs
description: Learn how to set up Azure Active Directory (Azure AD) to authenticate clients for Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: chackdan
ms.assetid: 15d0ab67-fc66-4108-8038-3584eeebabaa
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/28/2019
ms.author: atsenthi

---

# Set up Azure Active Directory for client authentication

For clusters running on Azure, Azure Active Directory (Azure AD) is recommended to secure access to management endpoints.  This article describes how to setup Azure AD to authenticate clients for a Service Fabric cluster, which must be done before [creating the cluster](service-fabric-cluster-creation-via-arm.md).  Azure AD enables organizations (known as tenants) to manage user access to applications. Applications are divided into those with a web-based sign-in UI and those with a native client experience. 

A Service Fabric cluster offers several entry points to its management functionality, including the web-based [Service Fabric Explorer][service-fabric-visualizing-your-cluster] and [Visual Studio][service-fabric-manage-application-in-visual-studio]. As a result, you create two Azure AD applications to control access to the cluster: one web application and one native application.  After the applications are created, you assign users to read-only and admin roles.

> [!NOTE]
> You must complete the following steps before you create the cluster. Because the scripts expect cluster names and endpoints, the values should be planned and not values that you have already created.

## Prerequisites
In this article, we assume that you have already created a tenant. If you have not, start by reading [How to get an Azure Active Directory tenant][active-directory-howto-tenant].

To simplify some of the steps involved in configuring Azure AD with a Service Fabric cluster, we have created a set of Windows PowerShell scripts.

1. [Clone the repo](https://github.com/Azure-Samples/service-fabric-aad-helpers) to your computer.
2. [Ensure you have all prerequisites](https://github.com/Azure-Samples/service-fabric-aad-helpers#getting-started) for the scripts installed.

## Create Azure AD applications and assign users to roles

We'll use the scripts to create two Azure AD applications to control access to the cluster: one web application and one native application. After you create applications to represent your cluster, you'll create users for the [roles supported by Service Fabric](service-fabric-cluster-security-roles.md): read-only and admin.

Run `SetupApplications.ps1`, and provide the tenant ID, cluster name, and web application reply URL as parameters.  Also specify usernames and passwords for the users. For example:

```powershell
$Configobj = .\SetupApplications.ps1 -TenantId '0e3d2646-78b3-4711-b8be-74a381d9890c' -ClusterName 'mysftestcluster' -WebApplicationReplyUrl 'https://mysftestcluster.eastus.cloudapp.azure.com:19080/Explorer/index.html' -AddResourceAccess
.\SetupUser.ps1 -ConfigObj $Configobj -UserName 'TestUser' -Password 'P@ssword!123'
.\SetupUser.ps1 -ConfigObj $Configobj -UserName 'TestAdmin' -Password 'P@ssword!123' -IsAdmin
```

> [!NOTE]
> For national clouds (for example Azure Government, Azure China, Azure Germany), you should also specify the `-Location` parameter.

You can find your *TenantId* by executing the PowerShell command `Get-AzureSubscription`. Executing this command displays the TenantId for every subscription.

*ClusterName* is used to prefix the Azure AD applications that are created by the script. It does not need to match the actual cluster name exactly. It is intended only to make it easier to map Azure AD artifacts to the Service Fabric cluster that they're being used with.

*WebApplicationReplyUrl* is the default endpoint that Azure AD returns to your users after they finish signing in. Set this endpoint as the Service Fabric Explorer endpoint for your cluster, which by default is:

https://&lt;cluster_domain&gt;:19080/Explorer

You are prompted to sign in to an account that has administrative privileges for the Azure AD tenant. After you sign in, the script creates the web and native applications to represent your Service Fabric cluster. If you look at the tenant's applications in the [Azure portal][azure-portal], you should see two new entries:

   * *ClusterName*\_Cluster
   * *ClusterName*\_Client

The script prints the JSON required by the Azure Resource Manager template when you [create the cluster](service-fabric-cluster-creation-create-template.md#add-azure-ad-configuration-to-use-azure-ad-for-client-access), so it's a good idea to keep the PowerShell window open.

```json
"azureActiveDirectory": {
  "tenantId":"<guid>",
  "clusterApplication":"<guid>",
  "clientApplication":"<guid>"
},
```

## Troubleshooting help in setting up Azure Active Directory
Setting up Azure AD and using it can be challenging, so here are some pointers on what you can do to debug the issue.

### Service Fabric Explorer prompts you to select a certificate
#### Problem
After you sign in successfully to Azure AD in Service Fabric Explorer, the browser returns to the home page but a message prompts you to select a certificate.

![SFX certificate dialog][sfx-select-certificate-dialog]

#### Reason
The user isn’t assigned a role in the Azure AD cluster application. Thus, Azure AD authentication fails on Service Fabric cluster. Service Fabric Explorer falls back to certificate authentication.

#### Solution
Follow the instructions for setting up Azure AD, and assign user roles. Also, we recommend that you turn on “User assignment required to access app,” as `SetupApplications.ps1` does.

### Connection with PowerShell fails with an error: "The specified credentials are invalid"
#### Problem
When you use PowerShell to connect to the cluster by using “AzureActiveDirectory” security mode, after you sign in successfully to Azure AD, the connection fails with an error: "The specified credentials are invalid."

#### Solution
This solution is the same as the preceding one.

### Service Fabric Explorer returns a failure when you sign in: "AADSTS50011"
#### Problem
When you try to sign in to Azure AD in Service Fabric Explorer, the page returns a failure: "AADSTS50011: The reply address &lt;url&gt; does not match the reply addresses configured for the application: &lt;guid&gt;."

![SFX reply address does not match][sfx-reply-address-not-match]

#### Reason
The cluster (web) application that represents Service Fabric Explorer attempts to authenticate against Azure AD, and as part of the request it provides the redirect return URL. But the URL is not listed in the Azure AD application **REPLY URL** list.

#### Solution
Select "App registrations" in AAD page, select your cluster application, and then select the **Reply URLs** button. On "Reply URLs" page, add the URL of Service Fabric Explorer to the list or replace one of the items in the list. When you have finished, save your change.

![Web application reply url][web-application-reply-url]

### Connect the cluster by using Azure AD authentication via PowerShell
To connect the Service Fabric cluster, use the following PowerShell command example:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <endpoint> -KeepAliveIntervalInSec 10 -AzureActiveDirectory -ServerCertThumbprint <thumbprint>
```

To learn more, see [Connect-ServiceFabricCluster cmdlet](https://docs.microsoft.com/powershell/module/servicefabric/connect-servicefabriccluster).

### Can I reuse the same Azure AD tenant in multiple clusters?
Yes. But remember to add the URL of Service Fabric Explorer to your cluster (web) application. Otherwise, Service Fabric Explorer doesn’t work.

### Why do I still need a server certificate while Azure AD is enabled?
FabricClient and FabricGateway perform a mutual authentication. During Azure AD authentication, Azure AD integration provides a client identity to the server, and the server certificate is used to verify the server identity. For more information about Service Fabric certificates, see [X.509 certificates and Service Fabric][x509-certificates-and-service-fabric].

## Next steps
After setting up Azure Active Directory applications and setting roles for users, [configure and deploy a cluster](service-fabric-cluster-creation-via-arm.md).


<!-- Links -->
[azure-CLI]:https://docs.microsoft.com/cli/azure/get-started-with-azure-cli?view=azure-cli-latest
[azure-portal]: https://portal.azure.com/
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[active-directory-howto-tenant]:../active-directory/develop/quickstart-create-new-tenant.md
[service-fabric-visualizing-your-cluster]: service-fabric-visualizing-your-cluster.md
[service-fabric-manage-application-in-visual-studio]: service-fabric-manage-application-in-visual-studio.md
[sf-aad-ps-script-download]:http://servicefabricsdkstorage.blob.core.windows.net/publicrelease/MicrosoftAzureServiceFabric-AADHelpers.zip
[x509-certificates-and-service-fabric]: service-fabric-cluster-security.md#x509-certificates-and-service-fabric

<!-- Images -->
[sfx-select-certificate-dialog]: ./media/service-fabric-cluster-creation-setup-aad/sfx-select-certificate-dialog.png
[sfx-reply-address-not-match]: ./media/service-fabric-cluster-creation-setup-aad/sfx-reply-address-not-match.png
[web-application-reply-url]: ./media/service-fabric-cluster-creation-setup-aad/web-application-reply-url.png
