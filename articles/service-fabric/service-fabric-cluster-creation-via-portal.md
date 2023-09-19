---
title: Create a Service Fabric cluster in the Azure portal 
description: Learn how to set up a secure Service Fabric cluster in Azure using the Azure portal and Azure Key Vault.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Create a Service Fabric cluster in Azure using the Azure portal
> [!div class="op_single_selector"]
> * [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
> * [Azure portal](service-fabric-cluster-creation-via-portal.md)
> 
> 

This is a step-by-step guide that walks you through the steps of setting up a Service Fabric cluster (Linux or Windows) in Azure using the Azure portal. This guide walks you through the following steps:

* Create a cluster in Azure through the Azure portal.
* Authenticate administrators using certificates.

> [!NOTE]
> For more advanced security options, such as user authentication with Azure Active Directory and setting up certificates for application security, [create your cluster using Azure Resource Manager][create-cluster-arm].
> 
> 

## Cluster security 
Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications. For more information on how certificates are used in Service Fabric, see [Service Fabric cluster security scenarios][service-fabric-cluster-security].

If this is the first time you are creating a service fabric cluster or are deploying a cluster for test workloads, you can skip to the next section (**Create cluster in the Azure portal**) and have the system generate certificates needed for your clusters that run test workloads. If you are setting up a cluster for production workloads, then continue reading.

#### Cluster and server certificate (required)
This certificate is required to secure a cluster and prevent unauthorized access to it. It provides cluster security in a couple ways:

* **Cluster authentication:** Authenticates node-to-node communication for cluster federation. Only nodes that can prove their identity with this certificate can join the cluster.
* **Server authentication:** Authenticates the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster. This certificate also provides TLS for the HTTPS management API and for Service Fabric Explorer over HTTPS.

To serve these purposes, the certificate must meet the following requirements:

* The certificate must contain a private key.
* The certificate must be created for key exchange, exportable to a Personal Information Exchange (.pfx) file.
* The certificate's **subject name must match the domain** used to access the Service Fabric cluster. This is required to provide TLS for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain a TLS/SSL certificate from a certificate authority (CA) for the `.cloudapp.azure.com` domain. Acquire a custom domain name for your cluster. When you request a certificate from a CA the certificate's subject name must match the custom domain name used for your cluster.
* The certificate's list of DNS names must include the Fully Qualified Domain Name (FQDN) of the cluster.

#### Client authentication certificates
Additional client certificates authenticate administrators for cluster management tasks. Service Fabric has two access levels: **admin** and **read-only user**. At minimum, a single certificate for administrative access should be used. For additional user-level access, a separate certificate must be provided. For more information on access roles, see [role-based access control for Service Fabric clients][service-fabric-cluster-security-roles].

You do not need to upload Client authentication certificates to Key Vault to work with Service Fabric. These certificates only need to be provided to users who are authorized for cluster management. 

> [!NOTE]
> Azure Active Directory is the recommended way to authenticate clients for cluster management operations. To use Azure Active Directory, you must [create a cluster using Azure Resource Manager][create-cluster-arm].
> 
> 

#### Application certificates (optional)
Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

* Encryption and decryption of application configuration values
* Encryption of data across nodes during replication 

Application certificates cannot be configured when [creating a cluster through the Azure portal](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/service-fabric/service-fabric-cluster-creation-via-portal.md). To configure application certificates at cluster setup time, you must [create a cluster using Azure Resource Manager][create-cluster-arm]. You can also add application certificates to the cluster after it has been created.

## Create cluster in the Azure portal

Creating a production cluster to meet your application needs involves some planning, to help you with that, it is strongly recommended that you read and understand the [Service Fabric Cluster planning considerations][service-fabric-cluster-capacity] document. 

### Search for the Service Fabric cluster resource

Sign in to the [Azure portal](https://portal.azure.com).
Click **Create a resource** to add a new resource template. Search for the Service Fabric Cluster template in the **Marketplace** under **Everything**.
Select **Service Fabric Cluster** from the list.

![search for Service Fabric cluster template on the Azure portal.][SearchforServiceFabricClusterTemplate]

Navigate to the **Service Fabric Cluster** blade, and click **Create**.

The **Create Service Fabric cluster** blade has the following four steps:

### 1. Basics
![Screenshot of creating a new resource group.][CreateRG]

In the Basics blade, you need to provide the basic details for your cluster.

1. Enter the name of your cluster.
2. Enter a **User name** and **Password** for Remote Desktop for the VMs.
3. Make sure to select the **Subscription** that you want your cluster to be deployed to, especially if you have multiple subscriptions.
4. Create a new **Resource group**. It is best to give it the same name as the cluster, since it helps in finding them later, especially when you are trying to make changes to your deployment or delete your cluster.
   
   > [!NOTE]
   > Although you can decide to use an existing resource group, it is a good practice to create a new resource group. This makes it easy to delete clusters and all the resources it uses.
   > 
   > 
5. Select the **Location** in which you want to create the cluster. If you are planning to use an existing certificate that you have already uploaded to a key vault, You must use the same region that your Key vault is in. 

### 2. Cluster configuration
![Create a node type][CreateNodeType]

Configure your cluster nodes. Node types define the VM sizes, the number of VMs, and their properties. Your cluster can have more than one node type, but the primary node type (the first one that you define on the portal) must have at least five VMs, as this is the node type where Service Fabric system services are placed. Do not configure **Placement Properties** because a default placement property of "NodeTypeName" is added automatically.

> [!NOTE]
> A common scenario for multiple node types is an application that contains a front-end service and a back-end service. You want to put the front-end service on smaller VMs (VM sizes like D2_V2) with ports open to the Internet, and put the back-end service on larger VMs (with VM sizes like D3_V2, D6_V2, D15_V2, and so on) with no Internet-facing ports open.
> 

1. Choose a name for your node type (1 to 12 characters containing only letters and numbers).
2. The minimum **size** of VMs for the primary node type is driven by the **Durability tier** you choose for the cluster. The default for the durability tier is bronze. For more information on durability, see [how to choose the Service Fabric cluster durability][service-fabric-cluster-durability].
3. Select the **Virtual machine size**. D-series VMs have SSD drives and are highly recommended for stateful applications. Do not use any VM SKU that has partial cores or have less than 10 GB of available disk capacity. Refer to [service fabric cluster planning consideration document][service-fabric-cluster-capacity] for help in selecting the VM size.
4.  **Single node cluster and three node clusters** are meant for test use only. They are not supported for any running production workloads.
5. Choose the **Initial virtual machine scale set capacity** for the node type. You can scale in or out the number of VMs in a node type later on, but on the primary node type, the minimum is five for production workloads. Other node types can have a minimum of one VM. The minimum **number** of VMs for the primary node type drives the **reliability** of your cluster.  
6. Configure **Custom endpoints**. This field allows you to enter a comma-separated list of ports that you want to expose through the Azure Load Balancer to the public Internet for your applications. For example, if you plan to deploy a web application to your cluster, enter "80" here to allow traffic on port 80 into your cluster. For more information on endpoints, see [communicating with applications][service-fabric-connect-and-communicate-with-services]
7. **Enable reverse proxy**.  The [Service Fabric reverse proxy](service-fabric-reverseproxy.md) helps microservices running in a Service Fabric cluster discover and communicate with other services that have http endpoints.
8. Back in the **Cluster configuration** blade, under **+Show optional settings**, configure cluster **diagnostics**. By default, diagnostics are enabled on your cluster to assist with troubleshooting issues. If you want to disable diagnostics change the **Status** toggle to **Off**. Turning off diagnostics is **not** recommended. If you already have Application Insights project created, then give its key, so that the application traces are routed to it.
9. **Include DNS service**.  The [DNS service](service-fabric-dnsservice.md) an optional service that enables you to find other services using the DNS protocol.
10. Select the **Fabric upgrade mode** you want set your cluster to. Select **Automatic**, if you want the system to automatically pick up the latest available version and try to upgrade your cluster to it. Set the mode to **Manual**, if you want to choose a supported version. For more details on the Fabric upgrade mode see the [Service Fabric Cluster Upgrade document.][service-fabric-cluster-upgrade]

> [!NOTE]
> We support only clusters that are running supported versions of Service Fabric. By selecting the **Manual** mode, you are taking on the responsibility to upgrade your cluster to a supported version.
> 

### 3. Security
![Screenshot of security configurations on Azure portal.][BasicSecurityConfigs]

To make setting up a secure test cluster easy for you, we have provided the **Basic** option. If you already have a certificate and have uploaded it to your [key vault](../key-vault/index.yml) (and enabled the key vault for deployment), then use the **Custom** option

#### Basic Option
Follow the screens to add or reuse an existing key vault and add a certificate. The addition of the certificate is a synchronous process and so you will have to wait for the certificate to be created.

Resist the temptation of navigating away from the screen until the preceding process is completed.

![Screenshot shows the Security page with Basic selected with the Key vault pane and Create key vault pane.][CreateKeyVault]

Now that the key vault is created, edit the access policies for your key vault. 

![Screenshot shows the Create Service Fabric cluster pane with option 3 Security selected and an explanation that the key vault is not enabled.][CreateKeyVault2]

Click on the **Edit access policies**, then **Show advanced access policies** and enable access to Azure Virtual Machines for deployment. It is recommended that you enable the template deployment as well. Once you have made your selections, do not forget to click the **Save** button and close out of the **Access policies** pane.

![Screenshot shows the Create Service Fabric cluster pane with the Security pane open and the Access policies pane open.][CreateKeyVault3]

Enter the name of the certificate and click **OK**.

![Screenshot shows the Create Service Fabric cluster pane with Security selected as before but without the explanation that the key vault is not enabled.][CreateKeyVault4]

#### Custom Option
Skip this section, if you have already performed the steps in the **Basic** Option.

![Screenshot shows the Security Configure cluster security settings dialog box.][SecurityCustomOption]

You need the Source key vault, Certificate URL, and Certificate thumbprint information to complete the security page. If you do not have it handy, open up another browser window and in the Azure portal do the following

1. Navigate to your key vault service.
2. Select the "Properties" tab and copy the 'RESOURCE ID'  to "Source key vault" on the other browser window 

    ![Screenshot shows the Properties window for the key vault.][CertInfo0]

3. Now, select the "Certificates" tab.
4. Click on certificate thumbprint, which takes you to the Versions page.
5. Click on the GUIDs you see under the current Version.

    ![Screenshot shows the Certificate window for the key vault][CertInfo1]

6. You should now be on the screen like below. Copy the hexadecimal SHA-1 Thumbprint to "Certificate thumbprint" on the other browser window
7. Copy the 'Secret Identifier' to the "Certificate URL" on other browser window.

    ![Screenshot shows the Certificate Version dialog box with an option to copy the Certificate Identifier.][CertInfo2]

Check the **Configure advanced settings** box to enter client certificates for **admin client** and **read-only client**. In these fields, enter the thumbprint of your admin client certificate and the thumbprint of your read-only user client certificate, if applicable. When administrators attempt to connect to the cluster, they are granted access only if they have a certificate with a thumbprint that matches the thumbprint values entered here.  

### 4. Summary

Now you are ready to deploy the cluster. Before you do that, download the certificate, look inside the large blue informational box for the link. Make sure to keep the cert in a safe place. you need it to connect to your cluster. Since the certificate you downloaded does not have a password, it is advised that you add one.

To complete the cluster creation, click **Create**. You can optionally download the template.

![Screenshot shows the Create Service Fabric cluster Summary page with a link to view and download a certificate.][Summary]

You can see the creation progress in the notifications. (Click the "Bell" icon near the status bar at the upper right of your screen.) If you clicked **Pin to Startboard** while creating the cluster, you see **Deploying Service Fabric Cluster** pinned to the **Start** board. This process will take some time. 

In order to perform management operations on your cluster using PowerShell or CLI, you need to connect to your cluster, read more on how to at [connecting to your cluster](service-fabric-connect-to-secure-cluster.md).

## View your cluster status
![Screenshot of cluster details in the dashboard.][ClusterDashboard]

Once your cluster is created, you can inspect your cluster in the portal:

1. Go to **Browse** and click **Service Fabric Clusters**.
2. Locate your cluster and click it.
3. You can now see the details of your cluster in the dashboard, including the cluster's public endpoint and a link to Service Fabric Explorer.

The **Node Monitor** section on the cluster's dashboard blade indicates the number of VMs that are healthy and not healthy. You can find more details about the cluster's health at [Service Fabric health model introduction][service-fabric-health-introduction].

> [!NOTE]
> Service Fabric clusters require a certain number of nodes to be up always to maintain availability and preserve state - referred to as "maintaining quorum". Therefore, it is typically not safe to shut down all machines in the cluster unless you have first performed a [full backup of your state][service-fabric-reliable-services-backup-restore].
> 
> 

## Remote connect to a Virtual Machine Scale Set instance or a cluster node
Each of the NodeTypes you specify in your cluster results in a Virtual Machine Scale Set getting set-up. <!--See [Remote connect to a Virtual Machine Scale Set instance][remote-connect-to-a-vm-scale-set] for details. -->

## Next steps
At this point, you have a secure cluster using certificates for management authentication. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).  Also, learn about [Service Fabric support options](service-fabric-support.md).

<!-- Links -->
[azure-powershell]: /powershell/azure/
[key-vault-get-started]: ../key-vault/general/overview.md
[create-cluster-arm]: service-fabric-cluster-creation-via-arm.md
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[service-fabric-cluster-security-roles]: service-fabric-cluster-security-roles.md
[service-fabric-cluster-capacity]: service-fabric-cluster-capacity.md
[service-fabric-cluster-durability]: service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster
[service-fabric-connect-and-communicate-with-services]: service-fabric-connect-and-communicate-with-services.md
[service-fabric-health-introduction]: service-fabric-health-introduction.md
[service-fabric-reliable-services-backup-restore]: service-fabric-reliable-services-backup-restore.md
[remote-connect-to-a-vm-scale-set]: service-fabric-cluster-nodetypes.md
[service-fabric-cluster-upgrade]: service-fabric-cluster-upgrade.md

<!--Image references-->
[SearchforServiceFabricClusterTemplate]: ./media/service-fabric-cluster-creation-via-portal/SearchforServiceFabricClusterTemplate.png
[CreateRG]: ./media/service-fabric-cluster-creation-via-portal/CreateRG.png
[CreateNodeType]: ./media/service-fabric-cluster-creation-via-portal/NodeType.png
[BasicSecurityConfigs]: ./media/service-fabric-cluster-creation-via-portal/BasicSecurityConfigs.PNG
[CreateKeyVault]: ./media/service-fabric-cluster-creation-via-portal/CreateKeyVault.PNG
[CreateKeyVault2]: ./media/service-fabric-cluster-creation-via-portal/CreateKeyVault2.PNG
[CreateKeyVault3]: ./media/service-fabric-cluster-creation-via-portal/CreateKeyVault3.PNG
[CreateKeyVault4]: ./media/service-fabric-cluster-creation-via-portal/CreateKeyVault4.PNG
[CertInfo0]: ./media/service-fabric-cluster-creation-via-portal/CertInfo0.PNG
[CertInfo1]: ./media/service-fabric-cluster-creation-via-portal/CertInfo1.PNG
[CertInfo2]: ./media/service-fabric-cluster-creation-via-portal/CertInfo2.PNG
[SecurityCustomOption]: ./media/service-fabric-cluster-creation-via-portal/SecurityCustomOption.PNG
[DownloadCert]: ./media/service-fabric-cluster-creation-via-portal/DownloadCert.PNG
[Summary]: ./media/service-fabric-cluster-creation-via-portal/Summary.PNG
[SecurityConfigs]: ./media/service-fabric-cluster-creation-via-portal/SecurityConfigs.png
[Notifications]: ./media/service-fabric-cluster-creation-via-portal/notifications.png
[ClusterDashboard]: ./media/service-fabric-cluster-creation-via-portal/ClusterDashboard.png
[cluster-security-cert-installation]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-cert-installation.png
