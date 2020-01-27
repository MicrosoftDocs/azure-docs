---
title: Configure certificates for applications on Linux 
description: Configure certificates for your app with the Service Fabric runtime on a Linux cluster

ms.topic: conceptual
ms.date: 09/06/2019
ms.author: pepogors

---
# Certificates and security on Linux clusters

This article provides information about configuring X.509 certificates on Linux clusters.

## Location and format of X.509 certificates on Linux nodes

Service Fabric generally expects X.509 certificates to be present in the */var/lib/sfcerts* directory on Linux cluster nodes. This is true of cluster certificates, client certificates, etc. In some cases, you can specify a location other than the *var/lib/sfcerts* folder for certificates. For example, with Reliable Services built using the Service Fabric Java SDK, you can specify a different location through the configuration package (Settings.xml) for some application-specific certificates. To learn more, see [Certificates referenced in the configuration package (Settings.xml)](#certificates-referenced-in-the-configuration-package-settingsxml).

For Linux clusters, Service Fabric expects certificates to be present as either a .pem file that contains both the certificate and private key or as a .crt file that contains the certificate and a .key file that contains the private key. All files should be in PEM format. 

If you install your certificate from Azure Key Vault by using either a [Resource Manager template](./service-fabric-cluster-creation-create-template.md) or [PowerShell](https://docs.microsoft.com/powershell/module/az.servicefabric/?view=azps-2.6.0) commands, the certificate is installed in the correct format in the */var/lib/sfcerts* directory on each node. If you install a certificate through another method, you must make sure that the certificate is correctly installed on cluster nodes.

## Certificates referenced in the application manifest

Certificates specified in the application manifest, for example, through the [**SecretsCertificate**](https://docs.microsoft.com/azure/service-fabric/service-fabric-service-model-schema-elements#secretscertificate-element) or [**EndpointCertificate**](https://docs.microsoft.com/azure/service-fabric/service-fabric-service-model-schema-elements#endpointcertificate-element) elements, must be present in the */var/lib/sfcerts* directory. The elements that are used to specify certificates in the application manifest do not take a path attribute, so the certificates must be present in the default directory. These elements do take an optional **X509StoreName** attribute. The default is "My", which points to the */var/lib/sfcerts* directory on Linux nodes. Any other value is undefined on a Linux cluster. We recommend that you omit the **X509StoreName** attribute for apps that run on Linux clusters. 

## Certificates referenced in the configuration package (Settings.xml)

For some services, you can configure X.509 certificates in the [ConfigPackage](./service-fabric-application-and-service-manifests.md) (by default, Settings.xml). For example, this is the case when you declare certificates used to secure RPC channels for Reliable Services services built with the Service Fabric .NET Core or Java SDKs. There are two ways to reference certificates in the configuration package. Support varies between the .NET Core and Java SDKs.

### Using X509 SecurityCredentialsType

WIth the .NET or Java SDKs, you can specify **X509** for the **SecurityCredentialsType**. This corresponds to the `X509Credentials` ([.NET](https://msdn.microsoft.com/library/system.fabric.x509credentials.aspx)/[Java](https://docs.microsoft.com/java/api/system.fabric.x509credentials)) type of `SecurityCredentials` ([.NET](https://msdn.microsoft.com/library/system.fabric.securitycredentials.aspx)/[Java](https://docs.microsoft.com/java/api/system.fabric.securitycredentials)).

The **X509** reference locates the certificate in a certificate store. The following XML shows the parameters used to specify the location of the certificate:

```xml
    <Parameter Name="SecurityCredentialsType" Value="X509" />
    <Parameter Name="CertificateStoreLocation" Value="LocalMachine" />
    <Parameter Name="CertificateStoreName" Value="My" />
```

For a service running on Linux, **LocalMachine**/**My** points to the default location for certificates, the */var/lib/sfcerts* directory. For Linux, any other combinations of **CertificateStoreLocation** and **CertificateStoreName** are undefined. 

Always specify **LocalMachine** for the **CertificateStoreLocation** parameter. There is no need to specify the **CertificateStoreName** parameter because it defaults to "My". With an **X509** reference, the certificate files must be located in the */var/lib/sfcerts* directory on the cluster node.  

The following XML shows a **TransportSettings** section based on this style:

```xml
<Section Name="HelloWorldStatefulTransportSettings">
    <Parameter Name="MaxMessageSize" Value="10000000" />
    <Parameter Name="SecurityCredentialsType" Value="X509" />
    <Parameter Name="CertificateFindType" Value="FindByThumbprint" />
    <Parameter Name="CertificateFindValue" Value="4FEF3950642138446CC364A396E1E881DB76B48C" />
    <Parameter Name="CertificateRemoteThumbprints" Value="9FEF3950642138446CC364A396E1E881DB76B483" />
    <Parameter Name="CertificateStoreLocation" Value="LocalMachine" />
    <Parameter Name="CertificateProtectionLevel" Value="EncryptAndSign" />
    <Parameter Name="CertificateRemoteCommonNames" Value="ServiceFabric-Test-Cert" />
</Section>
```

### Using X509_2 SecurityCredentialsType

With the Java SDK, you can specify **X509_2** for the **SecurityCredentialsType**. This corresponds to the `X509Credentials2` ([Java](https://docs.microsoft.com/java/api/system.fabric.x509credentials2)) type of `SecurityCredentials` ([Java](https://docs.microsoft.com/java/api/system.fabric.securitycredentials)). 

With an **X509_2** reference, you specify a path parameter, so you can locate the certificate in a directory other than */var/lib/sfcerts*.  The following XML shows the parameters used to specify the location of the certificate: 

```xml
     <Parameter Name="SecurityCredentialsType" Value="X509_2" />
     <Parameter Name="CertificatePath" Value="/path/to/cert/BD1C71E248B8C6834C151174DECDBDC02DE1D954.crt" />
```

The following XML shows a **TransportSettings** section based on this style.

```xml
<!--Section name should always end with "TransportSettings".-->
<!--Here we are using a prefix "HelloWorldStateless".-->
<Section Name="HelloWorldStatelessTransportSettings">
    <Parameter Name="MaxMessageSize" Value="10000000" />
    <Parameter Name="SecurityCredentialsType" Value="X509_2" />
    <Parameter Name="CertificatePath" Value="/path/to/cert/BD1C71E248B8C6834C151174DECDBDC02DE1D954.crt" />
    <Parameter Name="CertificateProtectionLevel" Value="EncryptandSign" />
    <Parameter Name="CertificateRemoteThumbprints" Value="BD1C71E248B8C6834C151174DECDBDC02DE1D954" />
</Section>
```

> [!NOTE]
> The certificate is specified as a .crt file in the preceding XML. This implies that there is also a .key file containing the private key in the same location.

## Configure a Reliable Services app to run on Linux clusters

The Service Fabric SDKs allow you to communicate with the Service Fabric runtime APIs to leverage the platform. When you run any application that uses this functionality on secure Linux clusters, you need to configure your application with a certificate that it can use to validate with the Service Fabric runtime. Applications that contain Service Fabric Reliable Service services written using the .NET Core or Java SDKs require this configuration. 

To configure an application, add a [**SecretsCertificate**](https://docs.microsoft.com/azure/service-fabric/service-fabric-service-model-schema-elements#secretscertificate-element) element under the **Certificates** tag, which is located under the **ApplicationManifest** tag in the *ApplicationManifest.xml* file. The following XML shows a certificate referenced by its thumbprint: 

```xml
   <Certificates>
       <SecretsCertificate X509FindType="FindByThumbprint" X509FindValue="0A00AA0AAAA0AAA00A000000A0AA00A0AAAA00" />
   </Certificates>   
```

You can reference either the cluster certificate or a certificate that you install on each cluster node. On Linux, the certificate files must be present in the */var/lib/sfcerts* directory. To learn more, see [Location and format of X.509 certificates on Linux nodes](#location-and-format-of-x509-certificates-on-linux-nodes).



