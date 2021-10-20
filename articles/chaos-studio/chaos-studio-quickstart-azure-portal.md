# Quickstart:Create and run a chaos experiment that uses a VM Shutdown fault 
Get started with Chaos Studio by using VM shutdown service-direct experiment to make your service more resilient to that failure in real-world. 

## Sign in to Azure portal 
Sign in to the Azure portal at https://portal.azure.com
## Create a VM resource
1. On the Azure portal menu or from the Home page, search for **Virtual machines** in the serach bar. 

    ![Search a virtual machine](images/search-virtual-machine.PNG)
    
2. Click on **Create**


    ![Click start in virtual machine](images/click-start-virtual-machine.PNG)
    
3. In **Create a virtual machine** provide values for the **Reasource group**, and **Virtual machine name**.

![Click start in virtual machine](images/create-virtual-machine.PNG)

4. Click **Review + create**, then create.

## Enable Chaos Studio on your VM created
1. Open the [Azure portal](https://portal.azure.com).
2. Search for **Chaos Studio (preview)** in the search bar.
3. Click on **Targets** and navigate to your VM created.

![Targets view in the Azure portal](images/quickstart-service-direct-targets.PNG)

4. Check the box next to your Cosmos DB account and click **Enable targets** then **Enable service-direct targets** from the dropdown menu.

![Enabling targets in the Azure portal](images/quickstart-service-direct-targets-enable.PNG)

5. A notification will appear indicating that the resource(s) selected were successfully enabled.

![Notification showing target successfully enabled](images/tutorial-service-direct-targets-enable-confirm.png)

## Create an experiment

1. Click **Add an experiment**.

    ![Add an experiment in Azure portal](images/add-an-experiment.png)

2. Fill in the Subscription, Resource Group, and Location where you want to deploy the chaos experiment. Give your experiment a Name. Click **Next : Experiment designer >**

![Add experiment basics](images/quickstart-service-direct-add-basics.PNG)

3. You are now in the Chaos Studio experiment designer. Give a friendly name to your Step and Branch, then click Add fault.

![Experiment designer](images/quickstart-service-direct-add-designer.PNG)

4. Select VM Shutdown from the dropdown, then fill in the Duration with the number of minutes you want the failure to last. Click **Next: Target resources >**

![Fault properties](images/quickstart-service-direct-add-fault.PNG)

5. Click **Next: Target resources >**
![Add a target](images/quickstart-service-direct-add-target.PNG)

6. Verify that your experiment looks correct, then click **Review + create**, then **Create**.

## Run your experiment
1. You are now ready to run the  experiment. 
2. In the Experiments view, click on your experiment, and click **Start**, then click **OK**.
3. When the Status changes to Running, click Details for the latest run under History to see details for the running experiment

## Clean up resources
1. Search the VM that you created on the Azure portal serach bar.
![Select the VM](images/quickstart-cleanup.PNG)

2. Click on **delete** to avoid being charged for the resource.

## Next steps
Now that you have run a VM shutdown service-direct experiment, you are ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based.md)

