The deployment process will take about **20 minutes**. Upon completion, the following resources will be created:

1. **Managed Identity** - This is the User assigned [managed identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) to manage credentials.
1. **Virtual machine** - This is a virtual machine that will act as your edge device.
1. **Disk** - This is a storage disk that is attached to the virtual machine to store media and artifacts.
1. **Network security group** - This is used to filter network traffic to and from Azure resources in an Azure virtual network.
1. **Network interface** - This enables an Azure Virtual Machine to communicate with internet, Azure, and other resources.
1. **Bastion connection** - This lets you connect to your virtual machine using your browser and the Azure portal.
1. **Public IP address** - This enables Azure resources to communicate to Internet and public-facing Azure services
1. **Virtual network** - This enables many types of Azure resources, such as your virtual machine, to securely communicate with each other, the internet, and on-premises networks. Learn more about [Virtual networks](../../../../../virtual-network/virtual-networks-overview.md)
1. **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.
1. **Video Analyzer account** - This helps with managing the Azure Video Analyzer provisioning token.
1. **Storage account** - You must have one Primary storage account and you can have any number of Secondary storage accounts associated with your Media Services account. For more information, see [Azure Storage accounts with Azure Media Services accounts](../../../../latest/storage-account-concept.md).

In addition to the resources mentioned above, following items are also created for use in the quickstarts :

* ***create-edge-device-on-hub*** - This file contains the **device connection string** which can be found under the **Outputs** tab in the left navigation pane.   
* ***deploy-and-configure-modules*** - This file contains the environment variables that you will need when running the code in Visual Studio Code.  

> [!TIP]
> If you run into issues with Azure resources that get created, please view our **troubleshooting guide** to resolve some commonly encountered issues.