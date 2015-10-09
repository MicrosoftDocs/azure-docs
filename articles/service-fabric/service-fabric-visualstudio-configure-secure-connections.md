<properties
   pageTitle="Configure Secure Connections | Microsoft Azure"
   description="Learn about how to use Visual Studio to configure secure connections that are supported by the Azure Service Fabric cluster."
   services="service-fabric"
   documentationCenter="na"
   authors="cawaMS"
   manager="paulyuk"
   editor="tglee" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="10/08/2015"
   ms.author="cawaMS" />

# Configure Secure Connections from Visual Studio

Learn about how to use Visual Studio to securely access a Service Fabric cluster with access control policies configured

## Cluster connection types

There are two types of connections supported by the Azure Service Fabric cluster: **non-secure** connections and **x509 certificate-based** secure connections. (For Service Fabric clusters hosted on-premises, **Windows** and **dSTS** authentications are also supported.) You have to configure the cluster connection type when the cluster is being created. Once created, the connection type can’t be changed.

The Visual Studio Service Fabric Tools support all authentication types for connecting to a cluster for publishing. See [Creating a Cluster using portal](https://www.yammer.com/azureadvisors/uploaded_files/40947687) for instructions on how to set up a secure Service Fabric cluster.

## Configure cluster connections in publish profiles

If you publish an Service Fabric project from Visual Studio, the **Publish** dialog enables you to choose an Azure Service Fabric cluster by clicking the **Select** button in **Connection endpoint** section. You can sign in to your Azure account and then select an existing cluster under your subscriptions.

The **Select Service Fabric Cluster** dialog box automatically validates the cluster connection. If validation passes, it means that your system has the correct certificates installed to connect to the cluster securely, or your cluster is non-secure. Validation failures can be caused by network issues or if your system hasn’t been correctly configured to connect to a secure cluster.

### To connect to a secure cluster

1.	Make sure you can access one of the client certificates trusted by the destination cluster. The certificate is usually shared as a Personal Information Exchange (.pfx) file. See [Creating a Cluster using portal](https://www.yammer.com/azureadvisors/uploaded_files/40947687) for how to configure the server for granting access to a client.

1.	Install the trusted certificate. To do this, double-click the .pfx file, or use the PowerShell script Import-PfxCertificate to import the certificates.

1.	Choose the **Publish...** command on the shortcut menu of the project to open the **Publish Azure Application** dialog box and then select the target cluster. The tool automatically resolves the connection and saves the secure connection parameters in the publish profile.

1.	[Optional]: You can edit the publish profile to specify a secure cluster connection.

    Since you're manually editing the Publish Profile xml file to specify the certificate information, be sure to note the certificate store name, store location, and certificate thumbprint. You'll need to provide these values for the certificate's store name and store location. See [How to: Retrieve the Thumbprint of a Certificate](https://msdn.microsoft.com/en-us/library/ms734695(v=vs.110).aspx) for more information.

    The *ClusterConnectionParameters* parameters enable you to specify the PowerShell parameters to use when connecting to the Service Fabric cluster. Valid parameters are any that are accepted by the Connect-ServiceFabricCluster cmdlet. See [Connect-ServiceFabricCluster](https://msdn.microsoft.com/en-us/library/mt125938.aspx) for a list of available parameters.

    If you’re publishing to a remote cluster, you need to specify the appropriate parameters for that specific cluster. The following is an example of for connecting to a non-secure cluster:

    `<ClusterConnectionParameters ConnectionEndpoint="mycluster.westus.cloudapp.azure.com:19000" />`

    Here’s an example for connecting to an x509 certificate-based secure cluster:

    ```
    <ClusterConnectionParameters
    ConnectionEndpoint="mycluster.westus.cloudapp.azure.com:19000"
    X509Credential="true"
    ServerCertThumbprint="0123456789012345678901234567890123456789"
    FindType="FindByThumbprint"
    FindValue="9876543210987654321098765432109876543210"
    StoreLocation="CurrentUser"
    StoreName="My" />
    ```

1.	Edit any other necessary settings, such as upgrade parameters and Application Instance Definition file location, and then publish your application from the **Publish Azure Application** dialog in Visual Studio.

## Next steps
For more information about accessing Service Fabric clusters, please see the following articles.

- [Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)