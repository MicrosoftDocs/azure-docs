
### DO NOT CHANGE VARIABLE (switch) VALUES AS THEY ARE REFERENCED IN THE DIRECTIVES ON THE AGGREGATED PAGE ###
### cONVENTIONS:
### For object creation the name value is given a prefix "my" such as myAmsAccount or myLiveEvent.
### For any other command, the name value is simply expressed as <amsAccountName> or liveEventName.
### This is to differentiate between giving something a name and referencing an object name.
### Where possible the shorthand command switch has been used instead of the verbose form.
### DO NOT DELETE THIS FILE.  SNIPPETS ARE USED IN MANY PAGES.

# AZURE
############################
#Subscription
# <SetSubscription>
az account set --subscription <subscriptionName>
# </SetSubscription>

# Azure storage
# <CreateStorage>
az storage account create -n <myStorageAccount> -g <resourceGroup>  --location <chooseLocation> --sku <chooseSKU>
# </CreateStorage>

# List locations
# <ListLocations>
az account list-locations
# </ListLocations>

# Create a resource group
# <CreateRG>
az group create -n <resourceGroupName> --location chooseLocation
# </CreateRG>

#AMS
############################
#type: command
#short-summary: Create an Azure Media Services account.
# <AmsAccountCreate>
az ams account create -g <resourceGroupName> -n <myAmsAccount> --storage-account <storageAccountName> 
# </AmsAccountCreate>

#type: command
#short-summary: Update the details of an Azure Media Services account.
# <AmsAccountUpdate>
az ams account update -g <resourceGroupName> -n <amsAccountName>
# </AmsAccountUpdate>

#type: command
#short-summary: List Azure Media Services accounts for the entire subscription.
# <AmsAccountList>
az ams account list
# </AmsAccountList>

#type: command
#short-summary: Show the details of an Azure Media Services account.
# <AmsAccountShow>
az ams account show -n <amsAccountName> -g <resourceGroupName>
# </AmsAccountShow>

#type: command
#short-summary: Delete an Azure Media Services account.
# <AmsAccountDelete>
az ams account delete -n <amsAccountName> -g <resourceGroupName>
# </AmsAccountDelete>

#type: command
#short-summary: Checks whether the Media Service resource name is available.
# <AmsAccountCheckName>
az ams account check-name --location <chooseLocation> -n <myAccountName>
# </AmsAccountCheckName>

#type: command
#short-summary: Show the details of encryption settings for an Azure Media Services account.
# <AmsAccountEncryptionShow>
az ams account encryption show -a <amsAccountName> -g <resourceGroupName>
# </AmsAccountEncryptionShow>

#type: command
#short-summary: Set the encryption settings for an Azure Media Services account.
#- name: Set the media account's encryption to a customer managed key
# <AmsAccountEncryptionSetCustomerManagedKey>
az ams account encryption set -a <amsAccountName> -g <resourceGroupName> --key-type <CustomerKey> --key-identifier <keyVaultId>
# </AmsAccountEncryptionSetCustomerManagedKey>

#- name: Set the media account's encryption to a system managed key
# <AmsAccountEncryptionSetSystemManagedKey>
az ams account encryption set -a <amsAccountName> -g <resourceGroupName> --key-type <SystemKey>
# </AmsAccountEncryptionSetSystemManagedKey>

#type: command
#short-summary: Attach a secondary storage to an Azure Media Services account.
# <AmsAccountStorageAdd>
az ams account storage add -g <resourceGroupName> -a <amsAccountName> -n <myStorageAccount>
# </AmsAccountStorageAdd>

#type: command
#short-summary: Detach a secondary storage from an Azure Media Services account.
# <AmsAccountStorageRemove>
az ams account storage remove -g <resourceGroupName> -a <storageAccountName> -n <amsAccountName>
# </AmsAccountStorageRemove>

#type: command
#short-summary: Create or update a service principal and configure its access to an Azure Media Services account.
#long-summary: Service principal propagation throughout Azure Active Directory may take some extra seconds to complete. 
# <AmsAccountSpCreatePassword>
az ams account sp create -a <amsAccountName> -g <resourceGroupName> -n <mySpName> --password <l33t541t&p3pp3r> --role <Owner> --xml    
# </AmsAccountSpCreatePassword>

# <AmsAccountSpCreateRole>
az ams account sp create -a <amsAccountName> -g <resourceGroupName> -n <mySpName> --new-sp-name <myNewSpName> --role <newRole>
# <AmsAccountSpCreateRole>

#type: command
#short-summary: Generate a new client secret for a service principal configured for an Azure Media Services account.
# <AmsAccountSpResetCredentials>
az ams account sp reset-credentials -a <amsAccountName> -g <resourceGroupName> 
# </AmsAccountSpResetCredentials>

#type: command
#short-summary: Synchronize storage account keys for a storage account associated with an Azure Media Services account.
# <AccountStorageSyncStorageKeys>
az ams account storage sync-storage-keys --storage-account-id
# </AccountStorageSyncStorageKeys>

#type: command
#short-summary: Set the authentication of a storage account attached to an Azure Media Services account.
# <AccountStorageSetAuthentication>
az ams account storage set-authentication --storage-auth
# </AccountStorageSetAuthentication>

#type: command
#short-summary: List all the transforms of an Azure Media Services account.
# <AmsTransformList>
az ams transform list -g <resourceGroupName> -a <amsAccountName>
# </AmsTransformList>

#type: command
#short-summary: Show the details of a transform.
# <AmsTransformShow>
az ams transform show -a <amsAccountName> -g <resourceGroupName> -n <transformName>
# </AmsTransformShow>

#type: command
#short-summary: Create a transform.
#- name: Create a transform with AdaptiveStreaming built-in preset and High relative priority.
# <AmsTransformCreate>
az ams transform create -a <amsAccountName> -n <transformName> -g <resourceGroupName> --preset <presetName> --relative-priority <priority>
# </AmsTransformCreate>

#- name: Create a transform with a custom Standard Encoder preset from a JSON file and Low relative priority.
# <AmsTransformCreateCustom>
az ams transform create -a <amsAccountName> -n <transformName> -g <resourceGroupName> --preset \"C:\\path\\to\\local\\preset\\CustomPreset.json\" --relative-priority <priority>
# </AmsTransformCreateCustom>

#type: command
#short-summary: Delete a transform.
# <AmsTransformDelete>
az ams transform delete -g <resourceGroupName> -a <amsAccountName> -n <transformName>
# </AmsTransformDelete>

#type: command
#short-summary: Update the details of a transform.
# <AmsTransformUpdate>
az ams transform update -a <amsAccountName> -n <transformName> -g <resourceGroupName> --set <outputs[0].relativePriority=High>
# </AmsTransformUpdate>

#type: command
#short-summary: Add an output to an existing transform.
#- name: Add an output with a custom Standard Encoder preset from a JSON file.
# <AmsTransformOutputAddCustom>
az ams transform output add -a <amsAccountName> -n <transformName> -g <resourceGroupName> --preset <\"C:\\path\\to\\local\\preset\\CustomPreset.json\">
# </AmsTransformOutputAddCustom>

### ONE OFF
#- name: Add an output with a VideoAnalyzer preset with es-ES as audio language and only with audio insights.
# <AmsTransformOutputAddAudio>
az ams transform output add -a <amsAccountName> -n <transformName> -g <resourceGroupName> --preset <presetName> --audio-language <es-ES> --insights-to-extract <AudioInsightsOnly>
# NOTE TO SELF what is the output index number?
# <AmsTransformOutputRemove>
az ams transform output remove -a <amsAccountName> -n <transformName> -g <resourceGroupName> --output-index <1>
# </AmsTransformOutputRemove>

#type: command
#short-summary: Show the details of an asset.
# <AmsAssetShow>
az ams asset show -a <amsAccountName> -g <resourceGroupName> -n <assetName>
# </AmsAssetShow>

#type: command
#short-summary: List all the assets of an Azure Media Services account.
# <AmsAssetList>
az ams asset list -g <resourceGroupName> -a <amsAccountName>
# </AmsAssetList>

#type: command
#short-summary: List streaming locators which are associated with this asset.
# <AmsAssetListStreamingLocators>
az ams asset list-streaming-locators -g <resourceGroupName> -a <amsAccountName> -n <assetName>
# </AmsAssetListStreamingLocators>

#type: command
#short-summary: Create an asset.
# <AmsAssetCreate>
az ams asset create -a <amsAccountName> -g <resourceGroupName> -n <myAsset>
# </AmsAssetCreate>

#type: command
#short-summary: Update the details of an asset.
# <AmsAssetUpdate>
az ams asset update -g <resourceGroupName> -a <amsAccountName> -n <assetName>
# </AmsAssetUpdate>

#type: command
#short-summary: Delete an asset.
# <AmsAssetDelete>
az ams asset delete -g <resourceGroupName> -a <amsAccountName> -n <assetName>
# </AmsAssetDelete>

#type: command
#short-summary: Lists storage container URLs with shared access signatures (SAS) for uploading and downloading Asset content. The signatures are derived from the storage account keys.
# <AmsAssetGetSASUrls>
az ams asset get-sas-urls -g <resourceGroupName> -a <amsAccountName> -n <assetName>
# </AmsAssetGetSASUrls>

#type: command
#short-summary: Get the asset storage encryption keys used to decrypt content created by version 2 of the Media Services API.
# <AmsAssetGetEncryptionKey>
az ams asset get-encryption-key -g <resourceGroupName> -a <amsAccountName> -n <assetName>
# </AmsAssetGetEncryptionKey>

#type: command
#short-summary: Create an asset filter.
# <AmsAssetFilterCreate>
az ams asset-filter create -a <amsAccountName> -g <resourceGroupName> --asset-name <assetName> -n myFilter
# </AmsAssetFilterCreate>

#type: command
#short-summary: Update the details of an asset filter.
# <AmsAssetFilterUpdate>
az ams asset-filter update -g <resourceGroupName> -a <amsAccountName> --asset-name <assetName> -n <assetFilterName>
# </AmsAssetFilterUpdate>

#type: command
#short-summary: Delete an asset filter.
# <AmsAssetFilterDelete>
az ams asset-filter delete -g <resourceGroupName> -a <amsAccountName> --asset-name <assetName> -name <assetFilterName>
# </AmsAssetFilterDelete>

# <AmsAssetFilterList>
az ams asset-filter list -g <resourceGroupName> -a <amsAccountName> --asset-name <assetName>
    #type: command
    #short-summary: List all the asset filters of an Azure Media Services account.
# </AmsAssetFilterList>

#type: command
#short-summary: Show the details of an asset filter.
# <AmsAssetFilterShow>
az ams asset-filter show -a <amsAccountName> -g <resourceGroupName> --asset-name <assetName> -n <assetFilterName>
# </AmsAssetFilterShow>

# <AmsContentKeyPolicyCreate>
az ams content-key-policy create -g <resourceGroupName> -a <amsAccountName> -n <contentKeyPolicyName> --policy-option-name policyOptionName
# </AmsContentKeyPolicyCreate>

#type: command
#short-summary: Show an existing content key policy.
# <AmsContentKeyPolicyShow>
az ams content-key-policy show -g <resourceGroupName> -a <amsAccountName> -n <contentKeyPolicyName>
# </AmsContentKeyPolicyShow>

#type: command
#short-summary: Delete a content key policy.
# <AmsContentKeyPolicyDelete>
az ams content-key-policy delete -g <resourceGroupName> -a <amsAccountName> -n <contentKeyPolicyName>
# </AmsContentKeyPolicyDelete>

#type: command
#short-summary: Update an existing content key policy.
# <AmsContentKeyPolicyUpdate>
az ams content-key-policy update -g <resourceGroupName> -a <amsAccountName> -n <contentKeyPolicyName>
# </AmsContentKeyPolicyUpdate>

#type: command
#short-summary: List all the content key policies within an Azure Media Services account.
# <AmsContentKeyPolicyList>
az ams content-key-policy list -g <resourceGroupName> -a <amsAccountName>
# </AmsContentKeyPolicyList>

#type: command
#short-summary: Add a new option to an existing content key policy.
# <AmsContentKeyPolicyOptionAdd>
az ams content-key-policy option add --policy-option-name <policyOptionName>
# </AmsContentKeyPolicyOptionAdd>

#type: command
#short-summary: Remove an option from an existing content key policy.
# <AmsContentKeyPolicyOptionRemove>
az ams content-key-policy option remove --policy-option-id <policyOptionId>
# </AmsContentKeyPolicyOptionRemove>

#type: command
#short-summary: Update an option from an existing content key policy.
# <AmsContentKeyPolicyOptionUpdate>
az ams content-key-policy option update --policy-option-id <policyOptionId>
# </AmsContentKeyPolicyOptionUpdate>

#type: command
#short-summary: Start a job.
# <AmsJobStart>
az ams job start --output-assets <outputAssets>
# </AmsJobStart>

# <AmsJobUpdate>
az ams job update -g <resourceGroupName> -a <amsAccountName> --t <transformName>  -n <jobName>
    #type: command
    #short-summary: Update an existing job.
# </AmsJobUpdate>

#type: command
#short-summary: List all the jobs of a transform within an Azure Media Services account.
# <AmsJobList>
az ams job list -g <resourceGroupName> -a <amsAccountName> -t <transformName>
# </AmsJobList>

#type: command
#short-summary: Show the details of a job.
# <AmsJobShow>
az ams job show -g <resourceGroupName> -a <amsAccountName> -t <transformName> -n <jobName>
# </AmsJobShow>

#type: command
#short-summary: Delete a job.
# <AmsJobDelete>
az ams job delete -g <resourceGroupName> -a <amsAccountName> -t <transformName> -n <jobName>
# </AmsJobDelete>

#type: command
#short-summary: Cancel a job.
# <AmsJobCancel>
az ams job cancel -g <resourceGroupName> -a <amsAccountName> -t <transformName> -n <jobName>
# </AmsJobCancel>

#type: command
#short-summary: Create a streaming locator.
# <AmsStreamingLocatorCreate>
az ams streaming-locator create -g <resourceGroupName> -a <amsAccountName> -n <streamingLocatorName> --streaming-policy-name <streamingPolicyName> --asset-name <assetName>
# </AmsStreamingLocatorCreate>

#type: command
#short-summary: List all the streaming locators within an Azure Media Services account.
# <AmsStreamingLocatorList>
az ams streaming-locator list -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingLocatorList>

#type: command
#short-summary: Show the details of a streaming locator.
# <AmsStreamingLocatorShow>
az ams streaming-locator show -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingLocatorShow>

#type: command
#short-summary: List paths supported by a streaming locator.
# <AmsStreamingLocatorGetPaths>
az ams streaming-locator get-paths -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingLocatorGetPaths>

#type: command
#short-summary: List content keys used by a streaming locator.
# <AmsStreamingLocatorListContentKeys>
az ams streaming-locator list-content-keys -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingLocatorListContentKeys>

#type: command
#short-summary: Create a streaming policy.
# <AmsStreamingPolicyCreate>
az ams streaming-policy create -g <resourceGroupName> -a <amsAccountName> -n <streamingPolicyName>
# </AmsStreamingPolicyCreate>

#type: command
#short-summary: List all the streaming policies within an Azure Media Services account.
# <AmsStreamingPolicyList>
az ams streaming-policy list -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingPolicyList>

#type: command
#short-summary: Show the details of a streaming policy.
# <AmsStreamingPolicyShow>
az ams streaming-policy show -g <resourceGroupName> -a <amsAccountName> -n <streamingPolicyName>
# </AmsStreamingPolicyShow>

#type: command
#short-summary: Start a streaming endpoint.
# <AmsStreamingEndpointStart>
az ams streaming-endpoint start -g <resourceGroupName> -a <amsAccountName> -n <streamingEndpointName>
# </AmsStreamingEndpointStart>

#type: command
#short-summary: Stop a streaming endpoint.
# <AmsStreamingEndpointStop>
az ams streaming-endpoint stop -g <resourceGroupName> -a <amsAccountName> -n <streamingEndpointName>
# </AmsStreamingEndpointStop>

#type: command
#short-summary: List all the streaming endpoints within an Azure Media Services account.
# <AmsStreamingEndpointList>
az ams streaming-endpoint list -g <resourceGroupName> -a <amsAccountName>
# </AmsStreamingEndpointList>

#type: command
#short-summary: Create a streaming endpoint.
# <AmsStreamingEndpointCreate>
az ams streaming-endpoint create -g <resourceGroupName> -a <amsAccountName> -n <streamingEndpointName> --scale-units x
# </AmsStreamingEndpointCreate>

#type: command
#short-summary: Place the CLI in a waiting state until a condition of the streaming endpoint is met.
# <AmsStreamingEndpointWait>
az ams streaming-endpoint wait -g <resourceGroupName> -a <amsAccountName> -n <streamingEndpointName>
# </AmsStreamingEndpointWait>

#type: command
#short-summary: Add an AkamaiAccessControl to an existing streaming endpoint.
# <AmsStreamingEndpointAkamaiAdd>
az ams streaming-endpoint akamai add -a <amsAccountName> -g <resourceGroupName> -n <streamingEndpointName>
# </AmsStreamingEndpointAkamaiAdd>

#type: command
#short-summary: Show the details of a streaming endpoint.
# <AmsStreamingEndpointShow>
az ams streaming-endpoint show -a <amsAccountName> -g <resourceGroupName> -n <streamingEndpointName>
# </AmsStreamingEndpointShow>

#type: command
#short-summary: Delete a streaming endpoint.
# <AmsStreamingEndpointDelete>
az ams streaming-endpoint delete -a <amsAccountName> -g <resourceGroupName> -n <streamingEndpointName>
# </AmsStreamingEndpointDelete>

#type: command
#short-summary: Remove an AkamaiAccessControl from an existing streaming endpoint.
# <AmsStreamingEndpointAkamaiRemove>
az ams streaming-endpoint akamai remove --identifier <identifier>
# </AmsStreamingEndpointAkamaiRemove>

#type: command
#short-summary: Set the scale of a streaming endpoint.
# <AmsStreamingEndpointScale>
az ams streaming-endpoint scale --scale-units <x>
# <AmsStreamingEndpointScale>

#type: command
#short-summary: Update the details of a streaming endpoint.
# <AmsStreamingEndpointUpdate>
az ams streaming-endpoint update -g <resourceGroupName> -a <amsAccountName> -n <streamingEndpointName>    
# </AmsStreamingEndpointUpdate>

#type: command
#short-summary: Create a live event.
# <AmsLiveEventCreate>
az ams live-event create -g <resourceGroupName> -a <amsAccountName> -n <myLiveEvent> --streaming-protocol <streamingProtocol> --ips <ipaddresses>
# </AmsLiveEventCreate>

#type: command
#short-summary: Start a live event.
# <AmsLiveEventStart>
az ams live-event start -g <resourceGroupName> -a <amsAccountName> -n <liveEventName>
# </AmsLiveEventStart>

#type: command
#short-summary: Allocate a live event to be started later.
# <AmsLiveEventStandby>
az ams live-event standby -g <resourceGroupName> -a <amsAccountName> -n <liveEventName>
# </AmsLiveEventStandby>

#type: command
 #short-summary: Show the details of a live event.
# <AmsLiveEventShow>
az ams live-event show -g <resourceGroupName> -a <amsAccountName> -n <liveEventName>
# </AmsLiveEventShow>

#type: command
#short-summary: List all the live events of an Azure Media Services account.
# <AmsLiveEventList>
az ams live-event list -g <resourceGroupName> -a <amsAccountName>
# </AmsLiveEventList>

#type: command
#short-summary: Delete a live event.
# <AmsLiveEventDelete>
az ams live-event delete -g <resourceGroupName> -a <amsAccountName>
# </AmsLiveEventDelete>

#type: command
#short-summary: Stop a live event.
# <AmsLiveEventStop>
az ams live-event stop -g <resourceGroupName> -a <amsAccountName>
# </AmsLiveEventStop>

#type: command
#short-summary: Reset a live event.
# <AmsLiveEventReset>
az ams live-event reset -g <resourceGroupName> -a <amsAccountName>
# </AmsLiveEventReset>

#type: command
    #short-summary: Update the details of a live event.
    #examples:
        #- name: Set a new allowed IP address and remove an existing IP address at index '0'.
          #text: >
            #az ams live-event update -a amsAccount -g resourceGroup -n liveEventName --remove input.accessControl.ip.allow 0 --add input.accessControl.ip.allow 1.2.3.4/22
        #- name: Clear existing IP addresses and set new ones.
          #text: >
            #az ams live-event update -a amsAccount -g resourceGroup -n liveEventName --ips 1.2.3.4/22 5.6.7.8/30
# <AmsLiveEventUpdate>
az ams live-event update -g <resourceGroupName> -a <amsAccountName> -n <liveEventName>
# <AmsLiveEventUpdate>

    #type: command
    #short-summary: Place the CLI in a waiting state until a condition of the live event is met.
    #examples:
        #- name: Place the CLI in a waiting state until the live event is created.
          #text: az ams live-event wait -g MyResourceGroup -a <amsAccountName> -n MyLiveEvent --created
# <AmsLiveEventWait>
az ams live-event wait -g <resourceGroupName> -a <amsAccountName> -n <liveEventName>
# </AmsLiveEventWait>

#type: command
#short-summary: Create a live output.
# <AmsLiveEOutputCreate>
az ams live-output create -g <resourceGroupName> -a <amsAccountName> --live-event-name <liveEventName> -n <myLiveOutput> --asset-name <assetName> --archive-window-length <X>
# </AmsLiveEOutputCreate>

#type: command
#short-summary: Show the details of a live output.
# <AmsLiveEOutputShow>
az ams live-output show -g <resourceGroupName> -a <amsAccountName> --live-event-name <liveEventName> -n <liveOutputName>
# </AmsLiveEOutputShow>

#type: command
    #short-summary: List all the live outputs in a live event.
# <AmsLiveOutputList>
az ams live-output list -g <resourceGroupName> -a <amsAccountName> --live-event-name <liveEventName>
# </AmsLiveOutputList>

# <AmsLiveOutputDelete>
az ams live-output delete -g <resourceGroupName> -a <amsAccountName> --live-event-name <liveEventName> -n <liveEventOutputName>
    #type: command
    #short-summary: Delete a live output.
# </AmsLiveOutputDelete>

# <AmsAccountFilterShow>
az ams account-filter show  -g <resourceGroupName> -a <amsAccountName> -n <accountFilterName>
    #type: command
    #short-summary: Show the details of an account filter.
# </AmsAccountFilterShow>

# <AmsAccountFilterList>
az ams account-filter list -g <resourceGroupName> -a <amsAccountName>
    #type: command
    #short-summary: List all the account filters of an Azure Media Services account.
# </AmsAccountFilterList>

#type: command
#short-summary: Create an account filter.
#examples:
#- name: Create an asset filter with filter track selections.
#text: >
#az ams account-filter create -a amsAccount -g resourceGroup -n filterName --force-end-timestamp=False --end-timestamp 200000 --start-timestamp 100000 --live-backoff-duration 60 --presentation-window-duration 600000 --timescale 1000 --first-quality 720 --tracks @C:\\tracks.json
# <AmsAccountFilterCreate>
az ams account-filter create -a <amsAccountName> -g <resourceGroupName> -n <myFilter>
# </AmsAccountFilterCreate>

# <AmsAccountFilterUpdate>
az ams account-filter update -g <resourceGroupName> -a <amsAccountName> -n <accountFilterName>
    #type: command
    #short-summary: Update the details of an account filter.
# </AmsAccountFilterUpdate>

# <AmsAccountFilterDelete>
az ams account-filter delete -g <resourceGroupName> -a <amsAccountName> -n <accountFilterName>
    #type: command
    #short-summary: Delete an account filter.
# </AmsAccountFilterDelete>
