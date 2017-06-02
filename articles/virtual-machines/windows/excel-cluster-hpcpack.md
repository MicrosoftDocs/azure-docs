---
title: HPC Pack cluster for Excel and SOA | Microsoft Docs
description: Get started running large-scale Excel and SOA workloads on an HPC Pack cluster in Azure
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager,hpc-pack

ms.assetid: cb6a9abe-caf3-44da-b911-849a50f6cfb3
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 06/01/2017
ms.author: danlep

---
# Get started running Excel and SOA workloads on an HPC Pack cluster in Azure
This article shows you how to deploy a Microsoft HPC Pack 2012 R2 cluster on Azure virtual machines by using an Azure quickstart template, or optionally an Azure PowerShell deployment script. The cluster uses Azure Marketplace VM images designed to run Microsoft Excel or service-oriented architecture (SOA) workloads with HPC Pack. You can use the cluster to run Excel HPC and SOA services from an on-premises client computer. The Excel HPC services include Excel workbook offloading and Excel user-defined functions, or UDFs.

> [!IMPORTANT] 
> This article is based on features, templates, and scripts for HPC Pack 2012 R2. This scenario is not currently supported in HPC Pack 2016.
>

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-both-include.md)]

At a high level, the following diagram shows the HPC Pack cluster you create.

![HPC cluster with nodes running Excel workloads][scenario]

## Prerequisites
* **Client computer** - You need a Windows-based client computer to submit sample Excel and SOA jobs to the cluster. You also need a Windows computer to run the Azure PowerShell cluster deployment script (if you choose that deployment method).
* **Azure subscription** - If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.
* **Cores quota** - You might need to increase the quota of cores, especially if you deploy several cluster nodes with multicore VM sizes. If you are using an Azure quickstart template, the cores quota in Resource Manager is per Azure region. In that case, you might need to increase the quota in a specific region. See [Azure subscription limits, quotas, and constraints](../../azure-subscription-service-limits.md). To increase a quota, [open an online customer support request](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.
* **Microsoft Office license** - If you deploy compute nodes using a Marketplace HPC Pack 2012 R2 VM image with Microsoft Excel, a 30-day evaluation version of Microsoft Excel Professional Plus 2013 is installed. After the evaluation period, you need to provide a valid Microsoft Office license to activate Excel to continue to run workloads. See [Excel activation](#excel-activation) later in this article. 

## Step 1. Set up an HPC Pack cluster in Azure
We show two options to set up the HPC Pack 2012 R2 cluster: first, using an Azure quickstart template and the Azure portal; and second, using an Azure PowerShell deployment script.

### Option 1. Use a quickstart template
Use an Azure quickstart template to quickly deploy an HPC Pack cluster in the Azure portal. When you open the template in the portal, you get a simple UI where you enter the settings for your cluster. Here are the steps. 

> [!TIP]
> If you want, use an [Azure Marketplace template](https://portal.azure.com/?feature.relex=*%2CHubsExtension#create/microsofthpc.newclusterexcelcn) that creates a similar cluster specifically for Excel workloads. The steps differ slightly from the following.
> 
> 

1. Visit the [Create HPC Cluster template page on GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/create-hpc-cluster). If you want, review information about the template and the source code.
2. Click **Deploy to Azure** to start a deployment with the template in the Azure portal.
   
   ![Deploy template to Azure][github]
3. In the portal, follow these steps to enter the parameters for the HPC cluster template.
   
   a. On the **Parameters** page, enter or modify values for the template parameters. (Click the icon next to each setting for help information.) Sample values are shown in the following screen. This example creates a cluster named *hpc01* in the *hpc.local* domain consisting of a head node and 2 compute nodes. The compute nodes are created from an HPC Pack VM image that includes Microsoft Excel.
   
   ![Enter parameters][parameters-new-portal]
   
   > [!NOTE]
   > The head node VM is created automatically from the [latest Marketplace image](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2onwindowsserver2012r2/) of HPC Pack 2012 R2 on Windows Server 2012 R2. Currently the image is based on HPC Pack 2012 R2 Update 3.
   > 
   > Compute node VMs are created from the latest image of the selected compute node family. Select the **ComputeNodeWithExcel** option for the latest HPC Pack compute node image that includes an evaluation version of Microsoft Excel Professional Plus 2013. To deploy a cluster for general SOA sessions or for Excel UDF offloading, choose the **ComputeNode** option (without Excel installed).
   > 
   > 
   
   b. Choose the subscription.
   
   c. Create a resource group for the cluster, such as *hpc01RG*.
   
   d. Choose a location for the resource group, such as Central US.
   
   e. On the **Legal terms** page, review the terms. If you agree, click **Purchase**. Then, when you are finished setting the values for the template, click **Create**.
4. When the deployment completes (it typically takes around 30 minutes), export the cluster certificate file from the cluster head node. In a later step, you import this public certificate on the client computer to provide the server-side authentication for secure HTTP binding.
   
   a. In the Azure portal, go to the dashboard, select the head node, and click **Connect** at the top of the page to connect using Remote Desktop.
   
    <!-- ![Connect to the head node][connect] -->
   
   b. Use standard procedures in Certificate Manager to export the head node certificate (located under Cert:\LocalMachine\My) without the private key. In this example, export *CN = hpc01.eastus.cloudapp.azure.com*.
   
   ![Export the certificate][cert]

### Option 2. Use the HPC Pack IaaS Deployment script
The HPC Pack IaaS deployment script provides another versatile way to deploy an HPC Pack cluster. It creates a cluster in the classic deployment model, whereas the template uses the Azure Resource Manager deployment model. Also, the script is compatible with a subscription in either the Azure Global or Azure China service.

**Additional prerequisites**

* **Azure PowerShell** - [Install and configure Azure PowerShell](/powershell/azure/overview) (version 0.8.10 or later) on your client computer.
* **HPC Pack IaaS deployment script** - Download and unpack the latest version of the script from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=44949). Check the version of the script by running `New-HPCIaaSCluster.ps1 –Version`. This article is based on version 4.5.0 or later of the script.

**Create the configuration file**

 The HPC Pack IaaS deployment script uses an XML configuration file as input that describes the infrastructure of the HPC cluster. To deploy a cluster consisting of a head node and 18 compute nodes created from the compute node image that includes Microsoft Excel, substitute values for your environment into the following sample configuration file. For more information about the configuration file, see the Manual.rtf file in the script folder and [Create an HPC cluster with the HPC Pack IaaS deployment script](classic/hpcpack-cluster-powershell-script.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

```
<?xml version="1.0" encoding="utf-8"?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionName>MySubscription</SubscriptionName>
    <StorageAccount>hpc01</StorageAccount>
  </Subscription>
  <Location>West US</Location>
  <VNet>
    <VNetName>hpc-vnet01</VNetName>
    <SubnetName>Subnet-1</SubnetName>
  </VNet>
  <Domain>
    <DCOption>NewDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
    <DomainController>
      <VMName>HPCExcelDC01</VMName>
      <ServiceName>HPCExcelDC01</ServiceName>
      <VMSize>Medium</VMSize>
    </DomainController>
  </Domain>
   <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>HPCExcelHN01</VMName>
    <ServiceName>HPCExcelHN01</ServiceName>
    <VMSize>Large</VMSize>
    <EnableRESTAPI/>
    <EnableWebPortal/>
    <PostConfigScript>C:\tests\PostConfig.ps1</PostConfigScript>
  </HeadNode>
  <ComputeNodes>
    <VMNamePattern>HPCExcelCN%00%</VMNamePattern>
    <ServiceName>HPCExcelCN01</ServiceName>
    <VMSize>Medium</VMSize>
    <NodeCount>18</NodeCount>
    <ImageName>HPCPack2012R2_ComputeNodeWithExcel</ImageName>
  </ComputeNodes>
</IaaSClusterConfig>
```

**Notes about the configuration file**

* The **VMName** of the head node **MUST** be the same as the **ServiceName**, or SOA jobs fail to run.
* Make sure you specify **EnableWebPortal** so that the head node certificate is generated and exported.
* The file specifies a post-configuration PowerShell script PostConfig.ps1 that runs on the head node. THe following sample script configures the Azure storage connection string, removes the compute node role from the head node, and brings all nodes online when they are deployed. 

```
    # add the HPC Pack powershell cmdlets
        Add-PSSnapin Microsoft.HPC

    # set the Azure storage connection string for the cluster
        Set-HpcClusterProperty -AzureStorageConnectionString 'DefaultEndpointsProtocol=https;AccountName=<yourstorageaccountname>;AccountKey=<yourstorageaccountkey>'

    # remove the compute node role for head node to make sure the Excel workbook won’t run on head node
        Get-HpcNode -GroupName HeadNodes | Set-HpcNodeState -State offline | Set-HpcNode -Role BrokerNode

    # total number of nodes in the deployment including the head node and compute nodes, which should match the number specified in the XML configuration file
        $TotalNumOfNodes = 19

        $ErrorActionPreference = 'SilentlyContinue'

    # bring nodes online when they are deployed until all nodes are online
        while ($true)
        {
          Get-HpcNode -State Offline | Set-HpcNodeState -State Online -Confirm:$false
          $OnlineNodes = @(Get-HpcNode -State Online)
          if ($OnlineNodes.Count -eq $TotalNumOfNodes)
          {
             break
          }
          sleep 60
        }
```

**Run the script**

1. Open the PowerShell console on the client computer as an administrator.
2. Change directory to the script folder (E:\IaaSClusterScript in this example).
   
   ```
   cd E:\IaaSClusterScript
   ```
3. To deploy the HPC Pack cluster, run the following command. This example assumes that the configuration file is located in E:\HPCDemoConfig.xml.
   
   ```
   .\New-HpcIaaSCluster.ps1 –ConfigFile E:\HPCDemoConfig.xml –AdminUserName MyAdminName
   ```

The HPC Pack deployment script runs for some time. One thing the script does is to export and download the cluster certificate and save it in the current user’s Documents folder on the client computer. The script generates a message similar to the following. In a following step, you import the certificate in the appropriate certificate store.    

    You have enabled REST API or web portal on HPC Pack head node. Please import the following certificate in the Trusted Root Certification Authorities certificate store on the computer where you are submitting job or accessing the HPC web portal:
    C:\Users\hpcuser\Documents\HPCWebComponent_HPCExcelHN004_20150707162011.cer

## Step 2. Offload Excel workbooks and run UDFs from an on-premises client
### Excel activation
When using the ComputeNodeWithExcel VM image for production workloads, you need to provide a valid Microsoft Office license key to activate Excel on the compute nodes. Otherwise, the evaluation version of Excel expires after 30 days, and running Excel workbooks will fail with the COMException (0x800AC472). 

You can rearm Excel for another 30 days of evaluation time: Log on to the head node and clusrun `%ProgramFiles(x86)%\Microsoft Office\Office15\OSPPREARM.exe` on all Excel compute nodes via HPC Cluster Manager. You can rearm a maximum of two times. After that, you must provide a valid Office license key.

The Office Professional Plus 2013 installed on the VM image is a volume edition with a Generic Volume License Key (GVLK). You can activate it via Key Management Service (KMS)/Active Directory-Based Activation (AD-BA) or Multiple Activation Key (MAK). 

    * To use KMS/AD-BA, use an existing KMS server or set up a new one by using the Microsoft Office 2013 Volume License Pack. (If you want to, set up the server on the head node.) Then, activate the KMS host key via the Internet or telephone. Then clusrun `ospp.vbs` to set the KMS server and port and activate Office on all the Excel compute nodes. 

    * To use MAK, first clusrun `ospp.vbs` to input the key and then activate all the Excel compute nodes via the Internet or telephone. 

> [!NOTE]
> Retail product keys for Office Professional Plus 2013 cannot be used with this VM image. If you have valid keys and installation media for Office or Excel editions other than this Office Professional Plus 2013 volume edition, you can use them instead. First uninstall this volume edition and install the edition that you have. The reinstalled Excel compute node can be captured as a customized VM image to use in a deployment at scale.
> 
> 

### Offload Excel workbooks
Follow these steps to offload an Excel workbook so that it runs on the HPC Pack cluster in Azure. To do this, you must have Excel 2010 or 2013 already installed on the client computer.

1. Use one of the options in Step 1 to deploy an HPC Pack cluster with the Excel compute node image. Obtain the cluster certificate file (.cer) and cluster username and password.
2. On the client computer, import the cluster certificate under Cert:\CurrentUser\Root.
3. Make sure Excel is installed. Create an Excel.exe.config file with the following contents in the same folder as Excel.exe on the client computer. This step ensures that the HPC Pack 2012 R2 Excel COM add-in loads successfully.
   
    ```
    <?xml version="1.0"?>
    <configuration>
        <startup useLegacyV2RuntimeActivationPolicy="true">
            <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.0"/>
        </startup>
    </configuration>
    ```
4. Set up the client to submit jobs to the HPC Pack cluster. One option is to download the full [HPC Pack 2012 R2 Update 3 installation](http://www.microsoft.com/download/details.aspx?id=49922) and install the HPC Pack client. Alternatively, download and install the [HPC Pack 2012 R2 Update 3 client utilities](https://www.microsoft.com/download/details.aspx?id=49923) and the appropriate Visual C++ 2010 redistributable for your computer ([x64](http://www.microsoft.com/download/details.aspx?id=14632), [x86](https://www.microsoft.com/download/details.aspx?id=5555)).
5. In this example, we use a sample Excel workbook named ConvertiblePricing_Complete.xlsb. You can download it [here](https://www.microsoft.com/en-us/download/details.aspx?id=2939).
6. Copy the Excel workbook to a working folder such as D:\Excel\Run.
7. Open the Excel workbook. On the **Develop** ribbon, click **COM Add-Ins** and confirm that the HPC Pack Excel COM add-in is loaded successfully.
   
   ![Excel add-in for HPC Pack][addin]
8. Edit the VBA macro HPCControlMacros in Excel by changing the commented lines as shown in the following script. Substitute appropriate values for your environment.
   
   ![Excel macro for HPC Pack][macro]
   
   ```
   'Private Const HPC_ClusterScheduler = "HEADNODE_NAME"
   Private Const HPC_ClusterScheduler = "hpc01.eastus.cloudapp.azure.com"
   
   'Private Const HPC_NetworkShare = "\\PATH\TO\SHARE\DIRECTORY"
   Private Const HPC_DependFiles = "D:\Excel\Upload\ConvertiblePricing_Complete.xlsb=ConvertiblePricing_Complete.xlsb"
   
   'HPCExcelClient.Initialize ActiveWorkbook
   HPCExcelClient.Initialize ActiveWorkbook, HPC_DependFiles
   
   'HPCWorkbookPath = HPC_NetworkShare & Application.PathSeparator & ActiveWorkbook.name
   HPCWorkbookPath = "ConvertiblePricing_Complete.xlsb"
   
   'HPCExcelClient.OpenSession headNode:=HPC_ClusterScheduler, remoteWorkbookPath:=HPCWorkbookPath
   HPCExcelClient.OpenSession headNode:=HPC_ClusterScheduler, remoteWorkbookPath:=HPCWorkbookPath, UserName:="hpc\azureuser", Password:="<YourPassword>"
   ```
9. Copy the Excel workbook to an upload directory such as D:\Excel\Upload. This directory is specified in the HPC_DependsFiles constant in the VBA macro.
10. To run the workbook on the cluster in Azure, click the **Cluster** button on the worksheet.

### Run Excel UDFs
To run Excel UDFs, follow the preceding steps 1 – 3 to set up the client computer. For Excel UDFs, you don't need to have the Excel application installed on compute nodes. So, when creating your cluster compute nodes, you could choose a normal compute node image instead of the compute node image with Excel.

> [!NOTE]
> There is a 34 character limit in the Excel 2010 and 2013 cluster connector dialog box. You use this dialog box to specify the cluster that runs the UDFs. If the full cluster name is longer (for example, hpcexcelhn01.southeastasia.cloudapp.azure.com), it does not fit in the dialog box. The workaround is to set a machine-wide variable such as *CCP_IAASHN* with the value of the long cluster name. Then, enter *%CCP_IAASHN%* in the dialog box as the cluster head node name. 
> 
> 

After the cluster is successfully deployed, continue with the following steps to run a sample built-in Excel UDF. For customized Excel UDFs, see these [resources](http://social.technet.microsoft.com/wiki/contents/articles/1198.windows-hpc-and-microsoft-excel-resources-for-building-cluster-ready-workbooks.aspx) to build the XLLs and deploy them on the IaaS cluster.

1. Open a new Excel workbook. On the **Develop** ribbon, click **Add-Ins**. Then, in the dialog box, click **Browse**, navigate to the %CCP_HOME%Bin\XLL32 folder, and select the sample ClusterUDF32.xll. If the ClusterUDF32 doesn't exist on the client machine, copy it from the %CCP_HOME%Bin\XLL32 folder on the head node.
   
   ![Select the UDF][udf]
2. Click **File** > **Options** > **Advanced**. Under **Formulas**, check **Allow user-defined XLL functions to run a compute cluster**. Then click **Options** and enter the full cluster name in **Cluster head node name**. (As noted previously this input box is limited to 34 characters, so a long cluster name may not fit. You may use a machine-wide variable here for a long cluster name.)
   
   ![Configure the UDF][options]
3. To run the UDF calculation on the cluster, click the cell with value =XllGetComputerNameC() and press Enter. The function simply retrieves the name of the compute node on which the UDF runs. For the first run, a credentials dialog box prompts for the username and password to connect to the IaaS cluster.
   
   ![Run UDF][run]
   
   When there are many cells to calculate, press Alt-Shift-Ctrl + F9 to run the calculation on all cells.

## Step 3. Run a SOA workload from an on-premises client
To run general SOA applications on the HPC Pack IaaS cluster, first use one of the methods in Step 1 to deploy the cluster. Specify a generic compute node image in this case, because you do not need Excel on the compute nodes. Then follow these steps.

1. After retrieving the cluster certificate, import it on the client computer under Cert:\CurrentUser\Root.
2. Install the [HPC Pack 2012 R2 Update 3 SDK](http://www.microsoft.com/download/details.aspx?id=49921) and [HPC Pack 2012 R2 Update 3 client utilities](https://www.microsoft.com/download/details.aspx?id=49923). These tools enable you to develop and run SOA client applications.
3. Download the HelloWorldR2 [sample code](https://www.microsoft.com/download/details.aspx?id=41633). Open the HelloWorldR2.sln in Visual Studio 2010 or 2012. (This sample is not currently compatible with more recent versions of Visual Studio.)
4. Build the EchoService project first. Then, deploy the service to the IaaS cluster in the same way you deploy to an on-premises cluster. For detailed steps, see the Readme.doc in HelloWordR2. Modify and build the HellWorldR2 and other projects as described in the following section to generate the SOA client applications that run on an Azure IaaS cluster.

### Use Http binding with Azure storage queue
To use Http binding with an Azure storage queue, make a few changes to the sample code.

* Update the cluster name.
  
    ```
  // Before
  const string headnode = "[headnode]";
  // After e.g.
  const string headnode = "hpc01.eastus.cloudapp.azure.com";
  or
  const string headnode = "hpc01.cloudapp.net";
  ```
* Optionally, use the default TransportScheme in SessionStartInfo or explicitly set it to Http.

```
    info.TransportScheme = TransportScheme.Http;
```

* Use default binding for the BrokerClient.
  
    ```
  // Before
  using (BrokerClient<IService1> client = new BrokerClient<IService1>(session, binding))
  // After
  using (BrokerClient<IService1> client = new BrokerClient<IService1>(session))
  ```
  
    Or set explicitly using the basicHttpBinding.
  
    ```
  BasicHttpBinding binding = new BasicHttpBinding(BasicHttpSecurityMode.TransportWithMessageCredential);
  binding.Security.Message.ClientCredentialType = BasicHttpMessageCredentialType.UserName;    binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.None;
  ```
* Optionally, set the UseAzureQueue flag to true in SessionStartInfo. If not set, it will be set to true by default when the cluster name has Azure domain suffixes and the TransportScheme is Http.
  
    ```
    info.UseAzureQueue = true;
  ```

### Use Http binding without Azure storage queue
To use Http binding without an Azure storage queue, explicitly set the UseAzureQueue flag to false in the SessionStartInfo.

```
    info.UseAzureQueue = false;
```

### Use NetTcp binding
To use NetTcp binding, the configuration is similar to connecting to an on-premises cluster. You need to open a few endpoints on the head node VM. If you used the HPC Pack IaaS deployment script to create the cluster, for example, set the endpoints in the Azure portal as follows.

1. Stop the VM.
2. Add the TCP ports 9090, 9087, 9091, 9094 for the Session, Broker, Broker worker, and Data services, respectively
   
    ![Configure endpoints][endpoint-new-portal]
3. Start the VM.

The SOA client application requires no changes except altering the head name to the IaaS cluster full name.

## Next steps
* See [these resources](http://social.technet.microsoft.com/wiki/contents/articles/1198.windows-hpc-and-microsoft-excel-resources-for-building-cluster-ready-workbooks.aspx) for more information about running Excel workloads with HPC Pack.
* See [Managing SOA Services in Microsoft HPC Pack](https://technet.microsoft.com/library/ff919412.aspx) for more about deploying and managing SOA services with HPC Pack.

<!--Image references-->
[scenario]: ./media/excel-cluster-hpcpack/scenario.png
[github]: ./media/excel-cluster-hpcpack/github.png
[template]: ./media/excel-cluster-hpcpack/template.png
[parameters]: ./media/excel-cluster-hpcpack/parameters.png
[parameters-new-portal]: ./media/excel-cluster-hpcpack/parameters-new-portal.png
[create]: ./media/excel-cluster-hpcpack/create.png
[connect]: ./media/excel-cluster-hpcpack/connect.png
[cert]: ./media/excel-cluster-hpcpack/cert.png
[addin]: ./media/excel-cluster-hpcpack/addin.png
[macro]: ./media/excel-cluster-hpcpack/macro.png
[options]: ./media/excel-cluster-hpcpack/options.png
[run]: ./media/excel-cluster-hpcpack/run.png
[endpoint]: ./media/excel-cluster-hpcpack/endpoint.png
[endpoint-new-portal]: ./media/excel-cluster-hpcpack/endpoint-new-portal.png
[udf]: ./media/excel-cluster-hpcpack/udf.png
