​

# Provision a Geo AI Virtual Machine on Azure 

​

The Geo AI Data Science Virtual Machine (Geo-DSVM) is a specially configured extension of the popular [Data Science Virtual Machine](http://aka.ms/dsvm) (DSVM) to make it easier to combine AI and Geospatial analytics powered by [ArcGIS Pro](https://www.arcgis.com/features/index.html) on Azure VM instances for rapidly training machine learning models including deep learning on data enriched with Geographic information. It is supported with Windows 2016 DSVM only. ​

The Geo-DSVM contains several tools for AI including GPU editions of popular deep learning frameworks like Microsoft Cognitive Toolkit, TensorFlow, Keras, Caffe2, Chainer; tools to acquire and pre-process image, textual data, tools for development activities such as Microsoft R Server Developer Edition, Anaconda Python, Jupyter notebooks for Python and R, IDEs for Python and R, SQL databases and many other data science and ML tools. On top of these it has the Esri's ArcGIS Pro desktop software along with Python and R interfaces for the same to work with geospatial data from your AI applications. 
​

## Create your Geo AI Data Science VM

Here are the steps to create an instance of the Deep Learning Virtual Machine: 


1. Navigate to the virtual machine listing on [Azure portal](https://ms.portal.azure.com/#create/microsoft-ads.geodsvmwindows).

2. Select the **Create** button at the bottom to be taken into a wizard.

![create-geo-ai-dsvm](./media/provision-geo-ai-dsvm/Create-Geo-AI.PNG)

3. The wizard used to create the Geo-DSVM requires **inputs** for each of the **four steps** enumerated on the right of this figure. Here are the inputs needed to configure each of these steps:

   

   1. **Basics**

      

      1. **Name**: Name of your data science server you are creating.

      2. **User Name**: Admin account login id.

      3. **Password**: Admin account password.

      4. **Subscription**: If you have more than one subscription, select the one on which the machine is to be created and billed.

      5. **Resource Group**: You can create a new one or use an **empty** existing Azure resource group in your subscription.

      6. **Location**: Select the data center that is most appropriate. Usually it is the data center that has most of your data or is closest to your physical location for fastest network access. 

      

> [!NOTE]

> If you are deep learning on GPU, you must choose one of the locations in Azure that has the NC-Series GPU VM instances. Currently the locations that have GPU VMs are: **East US, North Central US, South Central US, West US 2, North Europe, West Europe**. For the latest list, check the [Azure Products by Region Page](https://azure.microsoft.com/en-us/regions/services/) and look for **NC-Series** under **Compute**. 

​

   2. **Settings**: Select one of the NC-Series GPU virtual machine size if you plan to run deep learning on  GPU on your Geo DSVM. Otherwise, you can choose one of the CPU based instance.  Create a storage account for your VM.     

   3. **Summary**: Verify that all information you entered is correct.

   5. **Buy**: Click **Buy** to start the provisioning. A link is provided to the terms of the service. The VM does not have any additional charges beyond the compute for the server size you chose in the **Size** step. 

​

> [!NOTE]

> The provisioning should take about 20-30 minutes. The status of the provisioning is displayed on the Azure portal.

> 

​
## How to access the Geo AI Data Science Virtual Machine

​Once your VM is created, you are ready to start using the tools that are installed and pre-configured on it. There are start menu tiles and desktop icons for many of the tools. You can remote desktop into it using the Admin account credentials that you configured in the preceding **Basics** section. 

​
#### Using ArcGIS Pro installed in the VM

The Geo-DSVM has already ArcGIS Pro desktop pre-installed and the environment pre-configured to work with all the tools in the DSVM. When you start ArcGIS it will prompt for a login to your ArcGIS account. If you  already have an ArcGIS account and have licenses for the software, you can use your existing credentials.  

![Arc-GIS-Logon](./media/provision-geo-ai-dsvm/ArcGISLogon.png)

Otherwise, you can sign up for new ArcGIS account and license or get a [free trial](https://www.arcgis.com/features/free-trial.html). 

![ArcGIS-Free-Trial](./media/provision-geo-ai-dsvm/ArcGIS-Free-Trial.png)

Once you signup for a new paid or free trial ArcGIS account, you can authorize ArcGIS Pro for your account using the instructions in the [Getting Started with ArcGIS Pro documentation](http://www.esri.com/library/brochures/getting-started-with-arcgis-pro.pdf). 

After you sign in to ArcGIS Pro desktop with your ArcGIS account, you are ready to start using the tools that are installed and configured on the VM for your Geospatial data science and machine learning projects.

