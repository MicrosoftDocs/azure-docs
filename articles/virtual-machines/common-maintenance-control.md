


<1-- Is it limited to isolated VM types for public preview? What does "--maintenanceScope Host" do - does it make all VMs on that host have the same maintenance config? -->

Maintenance control lets you decide when to apply updates to your VMs.

With maintenance control, you can:
- Batch of updates into one update package 
- Wait up to 35 days to apply updates from the time it becomes available. 
- You can automate platform updates for your maintenance window using Azure Functions to start updating
- Maintenance configurations are work across subscriptions and resource groups. You can manage all of your maintenance configurations together and use them across subscriptions.

## Preview limitations


After 35-days update will automatically be applied and availability constraints will not be respected.

To perform above operations user must have Resource Owner access.


## Enable preview

For each subscription, register Maintenance Resource Provide (MRP) armclient post /subscriptions/<subscription id>/providers/Microsoft.Maintenance/register?api-version=2014-04-01-preview

Machine level settings (required once on each machine from where MRP commands will be executed): 
1. Install ARMClient used to invoke Azure Resource Manager API. You can install it from Chocolatey by running: choco source enable -n=chocolatey choco install armclient
1. Install Azure CLI from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest 
1. Add “Maintenance” extension az login az extension remove -n maintenance az extension add -y --source https://mrpcliextension.blob.core.windows.net/cliextension/maintenance-1.0.0-py2.py3-none-any.whl


## Create a maintenance configuration

Use [az maintenance configuration create]() to create a maintenance configuration. This example creates a maintance configuration named *myConfig* scoped to the host. Replace the example subscription ID with your own. 

```bash
az maintenance configuration create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g {resourceGroupName} \
   --name myConfig \
   --maintenanceScope Host \
   --location  eastus
```

Copy the configuration ID from the output to use later.

## Apply the configuration

Use [az maintenance assignment create]() to apply the configuration.

```bash
az maintenance assignment create \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   -maintenance-configuration-id "/subscriptions/1111abcd-1a11-1a2b-1a12-123456789abc/resourcegroups/myResourceGroup/providers/Microsoft.Maintenance/maintenanceConfigura tions/myConfig" \
   -l eastus
```

## Check for pending updates

Use [az maintenance update list]() to see if there are pending updates. Update --subscription to be the ID for the subscription that contains the VM.

```bash
az maintenance update list \
   --subscription 1111abcd-1a11-1a2b-1a12-123456789abc \
   -g myResourceGroup \
   -resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute
```





