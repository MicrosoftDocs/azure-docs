---
author: linda33wj
ms.service: data-factory
ms.topic: include
ms.date: 11/09/2018
ms.author: jingwang
---
## Create a self-hosted integration runtime

In this section, you create a self-hosted integration runtime and associate it with an on-premises machine with the SQL Server database. The self-hosted integration runtime is the component that copies data from SQL Server on your machine to Azure SQL database. 

1. Create a variable for the name of the integration runtime. Use a unique name, and make a note of it. You use it later in this tutorial. 

    ```powershell
   $integrationRuntimeName = "ADFTutorialIR"
    ```
2. Create a self-hosted integration runtime. 

   ```powershell
   Set-AzDataFactoryV2IntegrationRuntime -Name $integrationRuntimeName -Type SelfHosted -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName
   ```

   Here is the sample output:

   ```json
    Name              : <Integration Runtime name>
    Type              : SelfHosted
    ResourceGroupName : <ResourceGroupName>
    DataFactoryName   : <DataFactoryName>
    Description       : 
    Id                : /subscriptions/<subscription ID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.DataFactory/factories/<DataFactoryName>/integrationruntimes/ADFTutorialIR
    ```
  
3. To retrieve the status of the created integration runtime, run the following command. Confirm that the value of the **State** property is set to **NeedRegistration**. 

   ```powershell
   Get-AzDataFactoryV2IntegrationRuntime -name $integrationRuntimeName -ResourceGroupName $resourceGroupName -DataFactoryName $dataFactoryName -Status
   ```

   Here is the sample output:

   ```json  
   State                     : NeedRegistration
   Version                   : 
   CreateTime                : 9/24/2019 6:00:00 AM
   AutoUpdate                : On
   ScheduledUpdateDate       : 
   UpdateDelayOffset         : 
   LocalTimeZoneOffset       : 
   InternalChannelEncryption : 
   Capabilities              : {}
   ServiceUrls               : {eu.frontend.clouddatahub.net}
   Nodes                     : {}
   Links                     : {}
   Name                      : ADFTutorialIR
   Type                      : SelfHosted
   ResourceGroupName         : <ResourceGroup name>
   DataFactoryName           : <DataFactory name>
   Description               : 
   Id                        : /subscriptions/<subscription ID>/resourceGroups/<ResourceGroup name>/providers/Microsoft.DataFactory/factories/<DataFactory name>/integrationruntimes/<Integration Runtime name>
   ```

4. To retrieve the authentication keys used to register the self-hosted integration runtime with Azure Data Factory service in the cloud, run the following command: 

   ```powershell
   Get-AzDataFactoryV2IntegrationRuntimeKey -Name $integrationRuntimeName -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName | ConvertTo-Json
   ```

   Here is the sample output:

   ```json
   {
    "AuthKey1": "IR@0000000000-0000-0000-0000-000000000000@xy0@xy@xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
    "AuthKey2":  "IR@0000000000-0000-0000-0000-000000000000@xy0@xy@yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy="
   }
   ```    

5. Copy one of the keys (exclude the double quotation marks) used to register the self-hosted integration runtime that you install on your machine in the following steps.  

## Install the integration runtime tool

1. If you already have the integration runtime on your machine, uninstall it by using **Add or Remove Programs**. 

2. [Download](https://www.microsoft.com/download/details.aspx?id=39717) the self-hosted integration runtime on a local Windows machine. Run the installation.

3. On the **Welcome to Microsoft Integration Runtime Setup** page, select **Next**.

4. On the **End-User License Agreement** page, accept the terms and license agreement, and select **Next**.

5. On the **Destination Folder** page, select **Next**.

6. On the **Ready to install Microsoft Integration Runtime** page, select **Install**.

7. On the **Completed the Microsoft Integration Runtime Setup** page, select **Finish**.

8. On the **Register Integration Runtime (Self-hosted)** page, paste the key you saved in the previous section, and select **Register**. 

    ![Register the integration runtime](media/data-factory-create-install-integration-runtime/register-integration-runtime.png)

9. On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**. 

10. When the self-hosted integration runtime is registered successfully, you see the following message:

    ![Registered successfully](media/data-factory-create-install-integration-runtime/registered-successfully.png)

14. On the **Register Integration Runtime (Self-hosted)** page, select **Launch Configuration Manager**.

15. When the node is connected to the cloud service, you see the following page:

    ![Node is connected page](media/data-factory-create-install-integration-runtime/node-is-connected.png)

16. Now, test the connectivity to your SQL Server database.

    ![Diagnostics tab](media/data-factory-create-install-integration-runtime/config-manager-diagnostics-tab.png)   

    a. On the **Configuration Manager** page, go to the **Diagnostics** tab.

    b. Select **SqlServer** for the data source type.

    c. Enter the server name.

    d. Enter the database name.

    e. Select the authentication mode.

    f. Enter the user name.

    g. Enter the password that's associated with for the user name.

    h. Select **Test** to confirm that the integration runtime can connect to SQL Server. If the connection is successful, you see a green check mark. If the connection is not successful, you see an error message. Fix any issues, and ensure that the integration runtime can connect to SQL Server.    

    > [!NOTE]
    > Make a note of the values for authentication type, server, database, user, and password. You use them later in this tutorial.
