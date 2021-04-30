# What is "User data"

\"User data\" is a setup of script or other metadata you want to insert
to an Azure virtual machine at provision time. Any application on the
virtual machine can access the \"user data\" from the Azure virtual
machine instance metadata service (IMDS) throughout the lifetime of the
virtual machine.

"User data" is a new version of custom data ( [Custom data and Azure
Virtual Machines - Azure Virtual Machines \| Microsoft
Docs](https://docs.microsoft.com/en-us/azure/virtual-machines/custom-data))

, and it offers added benefits:

1.  "User data" will be exposed to Azure instance metadata service after
    provision. Users do not need to manage it as a local file.

2.  "User data" is persistent. It will be available in the lifetime of
    the VM.

3.  "User data" can be updated from outside the VM, without stopping or
    rebooting the VM.

4.  "User data" can be queried via GET VM/VMSS API with \$expand option.

> In addition, if you did not specify custom data or user data at
> provision time, you can still add it later after the provision, with
> the latest API version.

**Security warning**

Note "user data" will not be encrypted, and any process on the VM can
query this data. You should not save confidential information in "user
data".

# Create user data for an Azure VM/VMSS

Make sure you have upgraded to latest Azure ARM API version.

**Adding "User data" when you create new VM**

[For single VMs, new 'UserData' goes inside properties bag.]{.ul}

{{

\"name\": \"testVM_ϫ\",

\"location\": \"West US\",

\"properties\": {

\"hardwareProfile\": {

\"vmSize\": \"Standard_A1\"

},

\"storageProfile\": {

\"osDisk\": {

\"osType\": \"Windows\",

\"name\": \"osDisk\",

\"createOption\": \"Attach\",

\"vhd\": {

\"uri\":
\"http://myaccount.blob.core.windows.net/container/directory/blob.vhd\"

}

}

},

\"userData\": \"U29tZSBDdXN0b20gRGF0YQ==\",

\"networkProfile\": { \'networkInterfaces\' : \[ { \'name\' : \'nic1\' }
\] },

\"provisioningState\": 0

}

}}

**Adding "User data" when you create new VMSS**

[For VMSS, new 'UserData' goes inside virtualMachineProfile]{.ul}

{

\"location\": \"West US\",

\"sku\": {

\"name\": \"Standard_A1\",

\"capacity\": 1

},

\"properties\": {

\"upgradePolicy\": {

\"mode\": \"Automatic\"

},

\"virtualMachineProfile\": {

\"userData\": \"VXNlckRhdGE=\",

\"osProfile\": {

\"computerNamePrefix\": \"TestVM\",

\"adminUsername\": \"TestUserName\",

\"windowsConfiguration\": {

\"provisionVMAgent\": true,

\"timeZone\": \"Dateline Standard Time\"

}

},

\"storageProfile\": {

\"osDisk\": {

\"createOption\": \"FromImage\",

\"caching\": \"ReadOnly\"

},

\"imageReference\": {

\"publisher\": \"publisher\",

\"offer\": \"offer\",

\"sku\": \"sku\",

\"version\": \"1.2.3\"

}

},

\"networkProfile\":
{\"networkInterfaceConfigurations\":\[{\"name\":\"nicconfig1\",\"properties\":{\"ipConfigurations\":\[{\"name\":\"ip1\",\"properties\":{\"subnet\":{\"id\":\"vmssSubnet0\"}}}\]}}\]},

\"diagnosticsProfile\": {

\"bootDiagnostics\": {

\"enabled\": true,

\"storageUri\": \"https://crputest.blob.core.windows.net\"

}

}

},

\"provisioningState\": 0,

\"overprovision\": false,

\"uniqueId\": \"00000000-0000-0000-0000-000000000000\"

}

}

Retrieving "User data"

Applications running inside the VM can retrieve user data from IMDS
endpoint. For details, see
(<https://docs.microsoft.com/en-us/azure/virtual-machines/linux/instance-metadata-service?tabs=linux#get-user-data>
)

Customers may also retrieve existing value of user data via ARM API
using \$expand=userData endpoint (request body can be left empy).

Single VMs:

GET
\"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachines/{VMName}?\$expand=userData\"

VMSS:

GET
\"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMSSName}?\$expand=userData\"

VMSS VM:

GET
\"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMSSName}/virtualmachines/{vmss
instance id}?\$expand=userData\"

Updating "User data"

From Azure Rest API, you can use a normal PUT request to create/update
the VM user data. You can also user PATCH request to update the user
data. The user data will be updated without the need to stop or reboot
the VM.

PUT/PATCH

\"/subscriptions/{guid}/resourceGroups/{RGName}/providers/Microsoft.Compute/
virtualMachines/{VMName}

The VM.Properties in the 'update' request should contain your desired
UserData field, like this:

\"properties\": {

\"hardwareProfile\": {

\"vmSize\": \"Standard_D1_v2\"

},

\"storageProfile\": {

\"imageReference\": {

\"sku\": \"2016-Datacenter\",

\"publisher\": \"MicrosoftWindowsServer\",

\"version\": \"latest\",

\"offer\": \"WindowsServer\"

},

\"osDisk\": {

\"caching\": \"ReadWrite\",

\"managedDisk\": {

\"storageAccountType\": \"Standard_LRS\"

},

\"name\": \"vmOSdisk\",

\"createOption\": \"FromImage\"

}

},

\"networkProfile\": {

\"networkInterfaces\": \[

{

\"id\":
\"/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}\",

\"properties\": {

\"primary\": true

}

}

\]

},

\"osProfile\": {

\"adminUsername\": \"{your-username}\",

\"computerName\": \"{vm-name}\",

\"adminPassword\": \"{your-password}\"

},

\"diagnosticsProfile\": {

\"bootDiagnostics\": {

\"storageUri\":
\"http://{existing-storage-account-name}.blob.core.windows.net\",

\"enabled\": true

}

},

\"userData\": \"U29tZSBDdXN0b20gRGF0YQ==\"

}

# "Custom data" and "User data" 

"Custom data" will continue to work the same way as of today. However,
in the long term we recommend customers to switch to "User data." Note
you cannot retrieve "custom data" from IMDS.

# Adding User data to an existing VM 

If you have an existing VM without user data, including VM that already
has custom data, you can still add user data to this VM by using the
same updating commands, see the "Updating the User data" section for
details. Same applies to VMSS.
