<properties 
	pageTitle="Azure Cloud Services - Service Definition and Service Config - XML Certificate" 
	description="Learn how to configure a certificate in the service definition and config files." 
	services="cloud-services" 
	documentationCenter=".net" 
	authors="Thraka" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/20/2015"
	ms.author="adegeo"/>



# Configure the Service Definition and Config for a Certificate

Virtual Machines that are running your web or worker roles can have certificates associated with them. Once you've uploaded your certificate into the portal, you need to configure the service definition (.csdef) and service config (.cscfg) files for the certificate. 

The Virtual Machine can access the private key of the certificate after it has been installed. Because of this, you may want to restrict access to processes with elevated permissions. 

## Service definition example

Here is an example of a certificate defined in the service definition.

```xml
<ServiceDefinition name="WindowsAzureProject4" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
  <WorkerRole name="MyWokerRole"> <!-- or <WebRole name="MyWebRole" vmsize="Small"> -->
    <ConfigurationSettings>
      ...
    </ConfigurationSettings>
    <Certificates>
      <Certificate name="MySSLCert" storeLocation="LocalMachine" storeName="My" permissionLevel="elevated" />
    </Certificates>
  </WorkerRole>
</ServiceDefinition>
```

### Permissions
Permissions (`permisionLevel` attribute) can be set to one of the following:

| Permission Value  | Description |
| ----------------  | ----------- |
| limitedOrElevated | **(Default)** All role processes can access the private key. |
| elevated          | Only elevated processes can access the private key.|

## Service config example

Here is an example of a certificate defined in the service config.

```xml
<Role name="MyWokerRole">
...
    <Certificates>
        <Certificate name="MySSLCert" 
            thumbprint="9427befa18ec6865a9ebdc79d4c38de50e6316ff" 
            thumbprintAlgorithm="sha1" />
    </Certificates>
...
</Role>
```

**Note** the matching `name` attributes.

## Next steps
Review the [Service Definition XML](https://msdn.microsoft.com/library/azure/ee758711.aspx) schema and the [Service Config XML](https://msdn.microsoft.com/library/azure/ee758710.aspx) schema.