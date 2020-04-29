---
title: Azure SQL Edge Preview demo
description: Learn how to use ONNX in Azure SQL Edge
keywords: 
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 04/28/2020
---

# ONNX in Azure SQL Edge Preview demo

In this AzureSQLEdge_Demo demo, we will be predicting iron ore impurities as a % of Silica with ONNX in Azure SQL Edge. Before implementing the demo please ensure, you have an active Azure subscription and you have installed the below prerequisite software.

## Prerequisite software to be installed 
1. Install [Visual Studio Professions/Enterprise](https://visualstudio.microsoft.com/vs/)
2. Install [PowerShell 3.6.8](https://www.python.org/downloads/release/python-368/)
      * Windows x86-x64 Executable Installer
      * Ensure to add python path to the PATH environment variables
3. Install ["Microsoft Visual C++ 14.0" and build tools for Visual Studio](https://visualstudio.microsoft.com/downloads/) - Download can be located under "Tools For Visual Studio 2019"
4. Install [Microsoft ODBC Driver 17 for SQL Server](https://www.microsoft.com/download/details.aspx?id=56567)
5. Install [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver15)
6. Open Azure Data Studio and configure Python for Notebooks. Details on how to this can be accessed [here](https://docs.microsoft.com/sql/azure-data-studio/sql-notebooks?view=sql-server-ver15#configure-python-for-notebooks).This step can take several minutes.
7. Install latest version of [Azure CLI](https://github.com/Azure/azure-powershell/releases/tag/v3.5.0-February2020)
8. The below scripts require that the AZ PowerShell to be at the latest version (3.5.0, Feb 2020)

## Setting up Azure resources 
Importing modules needed to run the below PowerShell script
```powershell
Import-Module Az.Accounts -RequiredVersion 1.7.3
Import-Module -Name Az -RequiredVersion 3.5.0
Import-Module Az.IotHub -RequiredVersion 2.1.0
Import-Module Az.Compute -RequiredVersion 3.5.0
az extension add --name azure-cli-iot-ext
az extension add --name azure-cli-ml
```
Now, let us declare the variables required for the script to run 
```powershell
$ResourceGroup = "<name_of_the_resource_group>"
$IoTHubName = "<name_of_the_IoT_hub>"
$location = "<location_of_your_Azure_Subscription>"
$SubscriptionName = "<your_azure_subscription>"
$NetworkSecGroup = "<name_of_your_network_security_group>"
$StorageAccountName = "<name_of_your_storgae_account>"
```
Declaring rest of the variables
```powershell
$IoTHubSkuName = "S1"
$IoTHubUnits = 4
$EdgeDeviceId = "IronOrePredictionDevice"
$publicIpName = "VMPublicIP"
$imageOffer = "iot_edge_vm_ubuntu"
$imagePublisher = "microsoft_iot_edge"
$imageSku = "ubuntu_1604_edgeruntimeonly"
$AdminAcc = "iotadmin"
$AdminPassword = ConvertTo-SecureString "IoTAdmin@1234" -AsPlainText -Force
$VMSize = "Standard_DS3"
$NetworkName = "MyNet"
$NICName = "MyNIC"
$SubnetName = "MySubnet"
$SubnetAddressPrefix = "10.0.0.0/24"
$VnetAddressPrefix = "10.0.0.0/16"
$MyWorkSpace = "SQLDatabaseEdgeDemo"
$containerRegistryName = $ResourceGroup + "ContRegistry"
```
To begin creation of assets, let us log in into Azure 
```powershell
Login-AzAccount 

az login
```
Next, set the Azure Subscription ID
```powershell
Select-AzSubscription -Subscription $SubscriptionName
az account set --subscription $SubscriptionName
```
Check and create a resource group for running the demo 
```powershell
$rg = Get-AzResourceGroup -Name $ResourceGroup 
if($rg -eq $null)
{
    Write-Output("Resource Group $ResourceGroup does not exist, creating Resource Gorup")
    New-AzResourceGroup -Name $ResourceGroup -Location $location
}
else
{
    Write-Output ("Resource Group $ResourceGroup exists")
}
```
Check and create a Storage account and Storage account container in the Resource Group. Also create a container within the storage account and upload the zipped dacpac file. Generate a SAS URL for the file. 
```powershell
$sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
if ($sa -eq $null)
{
    New-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName -SkuName Standard_LRS -Location $location -Kind Storage
    $sa = Get-AzStorageAccount -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
    $storagekey = Get-AzStorageAccountKey -ResourceGroupName $ResourceGroup -Name $StorageAccountName 
    $storageContext = New-AzStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $storagekey[0].Value
    New-AzStorageContainer -Name "sqldatabasedacpac" -Context $storageContext 
}
else
{
   Write-Output ("Storage Account $StorageAccountName exists in Resource Group $ResourceGroup")     
}
```
Upload the Database Dacpac file to the Storage account and generate a SAS URL for the blob. Note down the SAS URL for the database dacpac blob
```powershell
$file = Read-Host "Please Enter the location to the zipped Database DacPac file:"
Set-AzStorageBlobContent -File $file -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context
$DacpacFileSASURL = New-AzStorageBlobSASToken -Container "sqldatabasedacpac" -Blob "SQLDatabasedacpac.zip" -Context $sa.Context -Permission r -StartTime (Get-Date).DateTime -ExpiryTime (Get-Date).AddMonths(12) -FullUri
```
Check and Create an Azure Container Registry within this Resource Group
```powershell
$containerRegistry = Get-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName 
if ($containerRegistry -eq $null)
{
    New-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName -Sku Standard -Location $location -EnableAdminUser 
    $containerRegistry = Get-AzContainerRegistry -ResourceGroupName $ResourceGroup -Name $containerRegistryName 
}
else
{
    Write-Output ("Container Registry $containerRegistryName exists in Resource Group $ResourceGroup")
}
```
Push the ARM/AMD docker images to the Container Registry.
```powershell
$containerRegistryCredentials = Get-AzContainerRegistryCredential -ResourceGroupName $ResourceGroup -Name $containerRegistryName

$amddockerimageFile = Read-Host "Please Enter the location to the amd docker tar file:"
$armdockerimageFile = Read-Host "Please Enter the location to the arm docker tar file:"
$amddockertag = $containerRegistry.LoginServer + "/silicaprediction" + ":amd64"
$armdockertag = $containerRegistry.LoginServer + "/silicaprediction" + ":arm64"

docker login $containerRegistry.LoginServer --username $containerRegistryCredentials.Username --password $containerRegistryCredentials.Password

docker import $amddockerimageFile $amddockertag
docker push $amddockertag

docker import $armdockerimageFile $armdockertag
docker push $armdockertag
```
Check and create the network security Group within the Resource Group. 
```powershell
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroup -Name $NetworkSecGroup 
if($nsg -eq $null)
{
    Write-Output("Network Security Group $NetworkSecGroup does not exist in the resource group $ResourceGroup")

    $rule1 = New-AzNetworkSecurityRuleConfig -Name "SSH" -Description "Allow SSH" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 22
    $rule2 = New-AzNetworkSecurityRuleConfig -Name "SQL" -Description "Allow SQL" -Access Allow -Protocol Tcp -Direction Inbound -Priority 101 -SourceAddressPrefix Internet -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 1600
    New-AzNetworkSecurityGroup -Name $NetworkSecGroup -ResourceGroupName $ResourceGroup -Location $location -SecurityRules $rule1, $rule2

    $nsg = Get-AzNetworkSecurityGroup -ResourceGroupName $ResourceGroup -Name $NetworkSecGroup
}
else
{
    Write-Output ("Network Security Group $NetworkSecGroup exists in the resource group $ResourceGroup")
}
```
Create an Edge enabled VM, which will act as an Edge Device. 
```powershell
$AzVM = Get-AzVM -ResourceGroupName $ResourceGroup -Name $EdgeDeviceId
If($AzVM -eq $null)
{
    Write-Output("The Azure VM with Name- $EdgeVMName is not present in the Resource Group- $ResourceGroup ")

    $SingleSubnet = New-AzVirtualNetworkSubnetConfig -Name $SubnetName -AddressPrefix $SubnetAddressPrefix
    $Vnet = New-AzVirtualNetwork -Name $NetworkName -ResourceGroupName $ResourceGroup -Location $location -AddressPrefix $VnetAddressPrefix -Subnet $SingleSubnet
    $publicIp = New-AzPublicIpAddress -Name $publicIpName -ResourceGroupName $ResourceGroup -AllocationMethod Static -Location $location  
    $NIC = New-AzNetworkInterface -Name $NICName -ResourceGroupName $ResourceGroup -Location $location -SubnetId $Vnet.Subnets[0].Id -NetworkSecurityGroupId $nsg.Id -PublicIpAddressId $publicIp.Id

     
    ##Set-AzNetworkInterfaceIpConfig -Name "ipconfig1"  -NetworkInterface $NIC -PublicIpAddress $publicIp

    $Credential = New-Object System.Management.Automation.PSCredential ($AdminAcc, $AdminPassword);

    $VirtualMachine = New-AzVMConfig -VMName $EdgeDeviceId -VMSize $VMSize
    $VirtualMachine = Set-AzVMOperatingSystem -VM $VirtualMachine -Linux -ComputerName $EdgeDeviceId -Credential $Credential
    $VirtualMachine = Add-AzVMNetworkInterface -VM $VirtualMachine -Id $NIC.Id  
    $VirtualMachine = Set-AzVMSourceImage -VM $VirtualMachine -PublisherName $imagePublisher -Offer $imageOffer -Skus $imageSku -Version latest 
    $VirtualMachine = Set-AzVMPlan -VM $VirtualMachine -Name $imageSku -Publisher $imagePublisher -Product $imageOffer

    $AzVM = New-AzVM -ResourceGroupName $ResourceGroup -Location $location -VM $VirtualMachine -Verbose
    $AzVM = Get-AzVM -ResourceGroupName $ResourceGroup -Name $EdgeDeviceId
       
}
else
{
    Write-Output ("The Azure VM with Name- $EdgeDeviceId is present in the Resource Group- $ResourceGroup ")
}

#################################################################################
## Check if the IoTHub Exists within the Resource Group
#################################################################################
$iotHub = Get-AzIotHub -ResourceGroupName $ResourceGroup -Name $IoTHubName
If($iotHub -eq $null)
{
    Write-Output("IoTHub $IoTHubName does not exists, creating The IoTHub in the resource group $ResourceGroup")
    New-AzIotHub -ResourceGroupName $ResourceGroup -Name $IoTHubName -SkuName $IoTHubSkuName -Units $IoTHubUnits -Location $location -Verbose
}
else
{
    Write-Output ("IoTHub $IoTHubName present in the resource group $ResourceGroup") 
}
```
Add an Edge Device to the IoT Hub. This step only creates the device digital identity
```powershell
$deviceIdentity = Get-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId
If($deviceIdentity -eq $null)
{
    Write-Output("The Edge Device with DeviceId- $EdgeDeviceId is not registered to the IoTHub- $IoTHubName ")
    Add-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId -EdgeEnabled  
}
else
{
    Write-Output ("The Edge Device with DeviceId- $EdgeDeviceId is registered to the IoTHub- $IoTHubName")
}
$deviceIdentity = Get-AzIotHubDevice -ResourceGroupName $ResourceGroup -IotHubName $IoTHubName -DeviceId $EdgeDeviceId
```
Get the device Primary connection String. This would be needed later for the VM. The next command uses Azure CLI for deployments.
```powershell
$deviceConnectionString = az iot hub device-identity show-connection-string --device-id $EdgeDeviceId --hub-name $IoTHubName --resource-group $ResourceGroup --subscription $SubscriptionName
$connString = $deviceConnectionString[1].Substring(23,$deviceConnectionString[1].Length-24)
$connString
```
Update the connection string in the Iot Edge config file on the Edge device. The next commands use Azure CLI for deployments.
```powershell
$script = "/etc/iotedge/configedge.sh '" + $connString + "'"
az vm run-command invoke -g $ResourceGroup -n $EdgeDeviceId  --command-id RunShellScript --script $script
```
Create an Azure Machine learning workspace within the Resource Group
```powershell
az ml workspace create -w $MyWorkSpace -g $ResourceGroup
```
## Predict iron impurities (% of Silica) with ONNX
The following python code can be collated in Jupyter notebook and run on Azure Data Studio. Before we begin with the experiment, we need to install and import the below packages.
```python
!pip install azureml.core -q
!pip install azureml.train.automl -q
!pip install matplotlib -q
!pip install pyodbc -q
!pip install spicy -q

import logging
from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
import pyodbc

from scipy import stats
from scipy.stats import skew #for some statistics

import azureml.core
from azureml.core.experiment import Experiment
from azureml.core.workspace import Workspace
from azureml.train.automl import AutoMLConfig
from azureml.train.automl import constants
```
Let us no proceed with defining the Azure AutoML workspace and AutoML experiment configuration for the regression experiment.
```python
ws = Workspace(subscription_id="<Azure Subscription ID>",
               resource_group="<resource group name>",
               workspace_name="TestAutoML")
# Choose a name for the experiment.
experiment_name = 'silic_percent2-Forecasting-onnx'
experiment = Experiment(ws, experiment_name)
```
Next, we will import the dataset into a panda frame. For the purpose of the model training, we will be using [this](https://www.kaggle.com/edumagalhaes/quality-prediction-in-a-mining-process) training data set from Kaggle. Download the data file and save it locally on your development machine. The main goal is to use this data to predict how much impurity is in the ore concentrate. 
```python
df = pd.read_csv("<path where you have saved the data file>",decimal=",",parse_dates=["date"],infer_datetime_format=True)
df = df.drop(['date'],axis=1)
df.describe()
```
We analyze the data to identify any skewness. During this process, we will look at the distribution and the skew information for each of the columns in the data frame. 
```python
## We can use a histogram chart to view the data distribution for the Dataset. In this example, we are looking at the histogram for the "% Silica Concentrate" 
## and the "% Iron Feed". From the histogram, you'll notice the data distribution is skewed for most of the features in the dataset. 

f, (ax1,ax2,ax3) = plt.subplots(1,3)
ax1.hist(df['% Iron Feed'], bins='auto')
#ax1.title = 'Iron Feed'
ax2.hist(df['% Silica Concentrate'], bins='auto')
#ax2.title = 'Silica Concentrate'
ax3.hist(df['% Silica Feed'], bins='auto')
#ax3.title = 'Silica Feed'
```
We check and fix the level of skewness in the data
```python
##Check data skewness with the skew or the kurtosis function in spicy.stats
##Skewness using the spicy.stats skew function
for i in list(df):
        print('Skew value for column "{0}" is: {1}'.format(i,skew(df[i])))

#Fix the Skew using Box Cox Transform
from scipy.special import boxcox1p
for i in list(df):
    if(abs(skew(df[i])) >= 0.20):
        #print('found skew in column - {0}'.format(i))
        df[i] = boxcox1p(df[i], 0.10)
        print('Skew value for column "{0}" is: {1}'.format(i,skew(df[i])))
```
Then we check the correlation fo other features with the prediction feature. If the correlation is not high, remove those features.
```python
silic_corr = df.corr()['% Silica Concentrate']
silic_corr = abs(silic_corr).sort_values()
drop_index= silic_corr.index[:8].tolist()
df = df.drop(drop_index, axis=1)
df.describe()
```
Now, start the AzureML experiment to find and train the best algorithm. IN this case, we are testing with all the regression algorithms, with a primary metric of Normalized Root Mean Squared Error (NRMSE). For more information, refer [Azure ML Experiments Primary Metric](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#primary-metric). The below code will start a local run of the ML experiment. 
```python
## Define the X_train and the y_train data sets for the AutoML experiments. X_Train are the inputs or the features, while y_train is the outcome or the prediction result. 

y_train = df['% Silica Concentrate']
x_train = df.iloc[:,0:-1]
automl_config = AutoMLConfig(task = 'regression',
                             primary_metric = 'normalized_root_mean_squared_error',
                             iteration_timeout_minutes = 60,
                             iterations = 10,                        
                             X = x_train, 
                             y = y_train,
                             featurization = 'off',
                             enable_onnx_compatible_models=True)

local_run = experiment.submit(automl_config, show_output = True)
best_run, onnx_mdl = local_run.get_output(return_onnx_model=True)
```
We proceed with loading the model in Azure SQL Edge database for local scoring 
```python
## Load the Model into a SQL Database.
## Define the Connection string parameters. These connection strings will be used later also in the demo.
server = '40.69.153.211,1600' # SQL Server IP address
username = 'sa' # SQL Server username
password = '<SQL Server password>'
database = 'IronOreSilicaPrediction'
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
cursor = conn.cursor()

# Insert the ONNX model into the models table
query = f"insert into models ([description], [data]) values ('Silica_Percentage_Predict_Regression_NRMSE_New1',?)"
model_bits = onnx_mdl.SerializeToString()
insert_params  = (pyodbc.Binary(model_bits))
cursor.execute(query, insert_params)
conn.commit()
cursor.close()
conn.close()
```
Finally, we use the Azure SQL Edge model to perform prediction using the trained model
```python
## Define the Connection string parameters. These connection strings will be used later also in the demo.
server = '40.69.153.211,1600' # SQL Server IP address
username = 'sa' # SQL Server username
password = '<SQL Server password>'
database = 'IronOreSilicaPrediction'
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
#cursor = conn.cursor()
query = \
        f'declare @model varbinary(max) = (Select [data] from [dbo].[Models] where [id] = 1);' \
        f' with d as ( SELECT  [timestamp] ,cast([cur_Iron_Feed] as real) [__Iron_Feed] ,cast([cur_Silica_Feed]  as real) [__Silica_Feed]' \
        f',cast([cur_Starch_Flow] as real) [Starch_Flow],cast([cur_Amina_Flow] as real) [Amina_Flow]' \
        f' ,cast([cur_Ore_Pulp_pH] as real) [Ore_Pulp_pH] ,cast([cur_Flotation_Column_01_Air_Flow] as real) [Flotation_Column_01_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_02_Air_Flow] as real) [Flotation_Column_02_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_03_Air_Flow] as real) [Flotation_Column_03_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_07_Air_Flow] as real) [Flotation_Column_07_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_04_Level] as real) [Flotation_Column_04_Level]' \
        f' ,cast([cur_Flotation_Column_05_Level] as real) [Flotation_Column_05_Level]' \
        f' ,cast([cur_Flotation_Column_06_Level] as real) [Flotation_Column_06_Level]' \
        f' ,cast([cur_Flotation_Column_07_Level] as real) [Flotation_Column_07_Level]' \
        f' ,cast([cur_Iron_Concentrate] as real) [__Iron_Concentrate]' \
        f' FROM [dbo].[IronOreMeasurements1]' \
        f' where timestamp between dateadd(hour,-1,getdate()) and getdate()) ' \
        f' SELECT d.*, p.variable_out1' \
        f' FROM PREDICT(MODEL = @model, DATA = d) WITH(variable_out1 numeric(25,17)) as p;' 
  
df_result = pd.read_sql(query,conn)
df_result.describe()
```
Using python we can create a chart of the predicted silica percentage against the iron feed, datetime, silica feed
```python
import plotly.graph_objects as go
fig = go.Figure()
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['__Iron_Feed'],mode='lines+markers',name='Iron Feed',line=dict(color='firebrick', width=2)))
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['__Silica_Feed'],mode='lines+markers',name='Silica Feed',line=dict(color='green', width=2)))
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['variable_out1'],mode='lines+markers',name='Silica Percent',line=dict(color='royalblue', width=3)))
fig.update_layout(height= 600, width=1500,xaxis_title='Time')
fig.show()
```

