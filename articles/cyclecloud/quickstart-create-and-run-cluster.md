# Azure CycleCloud QuickStart 2: Create and Run a Simple HPC Cluster

Until now, we’ve worked in the CycleCloud CLI to set up and log into CycleCloud. The steps from this point forward will be done within the GUI to familiarize you with the graphical interface of the tool.

## Select a Cluster Type

Click on "Clusters" in the main menu, which will bring up the list of available cluster types. These are built-in quick buttons for common cluster types, and expose a limited number of parameters in order to simplify and standardize cluster creation.

> [!NOTE]
> Azure CycleCloud ships with a limited number of supported cluster types by default, but many others are maintained in [CycleCloud GitHub](https://github.com/cyclecloud) and can easily be imported into CycleCloud.

In this quickstart, you will create an HPC cluster configured with [Open Grid Scheduler](http://gridscheduler.sourceforge.net/), which is the open source version of the Sun Grid Engine job scheduler. Click on **Grid Engine** to bring up the cluster creation wizard.

(kimli add screenshot here plz)

## New Cluster Settings

The ARM template set some of these settings for you, but others need to be set here. On the **About** page, enter the Cluster Name you specified in the first quickstart, then click **Next**.

### Required Settings

Under **Virtual Machines**, use the dropdown to select your region. **Master VM Type** and **Execute VM Type** refer to the infrastructure used in your cluster, and should be automatically populated for you.

Azure CycleCloud will automatically scale your cluster if you choose to enable it on this screen. For this quickstart, ensure that Autoscale is selected, and the Max Cores has been set to 100.

Under **Networking**, select the subnet to use for the compute infrastructure. Use `cyclevnet-compute` for this exercise, then click **Next**.

### Advanced Settings

Your credentials will be automatically set for you, based on the information you added to the `params-cyclecloud.json` file in the first quickstart. Software allows you to select the operating system and any custom specifications you have. The default CycleCloud cluster template has selected these, and do not need to be changed at this time.

The Advanced Networking options allow you to control access to and from your cluster. The default settings here are appropriate and do not need to be changed. Click **Save**.

## Usage Alert

Before you start your cluster, add an alert that will notify you if the accumulated usage cost has reached a specific limit. Click **Create New Alert** in the cluster summary window.

Set the Budget to $100.00 per month. Enable the Notifications, and add your email address in the **Recipients** field. This will send you an email when the cost hits $100 within the selected timeframe. Click **Save** to activate this alert.

## Start the Cluster

It's time to put your cluster to work. In the cluster summary window, click **Start** under the cluster name.

(screeeeeen)

Once the cluster is started, it will take several minutes to provision and orchestrate the VM for the cluster's master node, as well as install and configure the Grid Engine job queue and scheduler. You can monitor the progress in the Cluster VM Details tab, as well as in the Event Log.

QuickStart 2 ends here. You've used the GUI to configure your CycleCloud installation, and started up your cluster as well as setting a budget alert of $100. Continue on to [QuickStart 3](https://docs.microsoft.com/en-us/azure/cyclecloud/quickstart-submit-jobs) now!
