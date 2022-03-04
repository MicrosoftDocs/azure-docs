
# Azure storage
# <CreateStorage>
az storage account create --name mystorageaccount -g myRG --location chooseLocation --sku chooseSKU
# </CreateStorage>

# List locations
# <ListLocations>
az account list-locations
# </ListLocations>

# Create a resource group
# <CreateRG>
az group create --name myRG --location chooseLocation
# </CreateRG>

#type: command
#short-summary: Create an Azure Media Services account.
# <AmsAccountCreate>
az ams account create -g myRG -n myAmsAccount --storage-account myStorageAccount 
# </AmsAccountCreate>

# <AmsAccountUpdate>
az ams account update -g myRG -n myAmsAccount
    #type: command
    #short-summary: Update the details of an Azure Media Services account.

# </AmsAccountUpdate>

#type: command
#short-summary: List Azure Media Services accounts for the entire subscription.
# <AmsAccountList>
az ams account list
# </AmsAccountList>

# <AmsAccountShow>
az ams account show
    #type: command
    #short-summary: Show the details of an Azure Media Services account.

# </AmsAccountShow>

# <AmsAccountDelete>
az ams account delete
    #type: command
    #short-summary: Delete an Azure Media Services account.

# </AmsAccountDelete>

# <AmsAccountCheckName>
az ams account check-name
    #type: command
    #short-summary: Checks whether the Media Service resource name is available.

# </AmsAccountCheckName>

# <AmsAccountEncryption>
az ams account encryption
    #type: group
    #short-summary: Manage encryption for an Azure Media Services account.

# </AmsAccountEncryption>

# <AmsAccountEncryptionShow>
az ams account encryption show --account-name myAmsAccount -g myRG
    #type: command
    #short-summary: Show the details of encryption settings for an Azure Media Services account.
    #examples:
        #- name: Show the media account's encryption details
          #text: >
            #az ams account encryption show --account-name myAmsAccount -g myRG

# </AmsAccountEncryptionShow>

# <AmsAccountEncryptionSet>
az ams account encryption set -a myAmsAccount -g myRG --key-type CustomerKey --key-identifier keyVaultId
    #type: command
    #short-summary: Set the encryption settings for an Azure Media Services account.
    #examples:
        #- name: Set the media account's encryption to a customer managed key
          #text: >
            #az ams account encryption set -a myAmsAccount -g myRG --key-type CustomerKey --key-identifier keyVaultId
        #- name: Set the media account's encryption to a system managed key
          #text: >
            #az ams account encryption set -a myAmsAccount -g myRG --key-type SystemKey

# </AmsAccountEncryptionSet>

# <AmsAccountStorage>
az ams account storage
    #type: group
    #short-summary: Manage storage for an Azure Media Services account.

# </AmsAccountStorage>

# <AmsAccountStorageAdd>
az ams account storage add
    #type: command
    #short-summary: Attach a secondary storage to an Azure Media Services account.

# </AmsAccountStorageAdd>

# <AmsAccountStorageRemove>
az ams account storage remove
    #type: command
    #short-summary: Detach a secondary storage from an Azure Media Services account.

# </AmsAccountStorageRemove>

# <AmsAccountSp>
az ams account sp
    #type: group
    #short-summary: Manage service principal and role based access for an Azure Media Services account.

# </AmsAccountStorageSp>

# <AmsAccountSpCreate>
az ams account sp create
    #type: command
    #short-summary: Create or update a service principal and configure its access to an Azure Media Services account.
    long-summary: Service principal propagation throughout Azure Active Directory may take some extra seconds to complete.
    #examples:
        #- name: Create a service principal with password and configure its access to an Azure Media Services account. Output will be in xml format.
          #text: >
            #az ams account sp create -a myAmsAccount -g myRG -n mySpName --password mySecret --role Owner --xml
        #- name: Update a service principal with a new role and new name.
          #text: >
            #az ams account sp create -a myAmsAccount -g myRG -n mySpName --new-sp-name myNewSpName --role newRole
    
# </AmsAccountSpCreate>

# <AmsAccountSpResetCredentials>
az ams account sp reset-credentials
    #type: command
    #short-summary: Generate a new client secret for a service principal configured for an Azure Media Services account.

# <AmsAccountSpResetCredentials>

# <AccountStorageSyncStorageKeys>
az ams account storage sync-storage-keys
    #type: command
    #short-summary: Synchronize storage account keys for a storage account associated with an Azure Media Services account.

# </AccountStorageSyncStorageKeys>

# <AccountStorageSetAuthentication>
az ams account storage set-authentication
    #type: command
    #short-summary: Set the authentication of a storage account attached to an Azure Media Services account.

# </AccountStorageSetAuthentication>

# <AmsTransform>
az ams transform
    #type: group
    #short-summary: Manage transforms for an Azure Media Services account.

# </AmsTransform>

# <AmsTransformList>
az ams transform list
    #type: command
    #short-summary: List all the transforms of an Azure Media Services account.

# </AmsTransformList>

# <AmsTransformShow>
az ams transform show
    #type: command
    #short-summary: Show the details of a transform.

# </AmsTransformShow>

# <AmsTransformCreate>
az ams transform create
    #type: command
    #short-summary: Create a transform.
    #examples:
        #- name: Create a transform with AdaptiveStreaming built-in preset and High relative priority.
          #text: >
            #az ams transform create -a myAmsAccount -n transformName -g myResourceGroup --preset AdaptiveStreaming --relative-priority High
        #- name: Create a transform with a custom Standard Encoder preset from a JSON file and Low relative priority.
          #text: >
            #az ams transform create -a myAmsAccount -n transformName -g myResourceGroup --preset \"C:\\MyPresets\\CustomPreset.json\" --relative-priority Low
    
# </AmsTransformCreate>

# <AmsTransformDelete>
az ams transform delete
    #type: command
    #short-summary: Delete a transform.

# </AmsTransformDelete>

# <AmsTransformUpdate>
az ams transform update
    #type: command
    #short-summary: Update the details of a transform.
    #examples:
        #- name: Update the first transform output of a transform by setting its relative priority to High.
          #text: >
            #az ams transform update -a myAmsAccount -n transformName -g myResourceGroup --set outputs[0].relativePriority=High
    
# </AmsTransformUpdate>

# <AmsTransformOutput>
az ams transform output
    #type: group
    #short-summary: Manage transform outputs for an Azure Media Services account.

# </AmsTransformOutput>

# <AmsTransformOutputAdd>
az ams transform output add
    #type: command
    #short-summary: Add an output to an existing transform.
    #examples:
        #- name: Add an output with a custom Standard Encoder preset from a JSON file.
          #text: >
            #az ams transform output add -a myAmsAccount -n transformName -g myResourceGroup --preset \"C:\\MyPresets\\CustomPreset.json\"
        #- name: Add an output with a VideoAnalyzer preset with es-ES as audio language and only with audio insights.
          #text: >
            #az ams transform output add -a myAmsAccount -n transformName -g myResourceGroup --preset VideoAnalyzer --audio-language es-ES --insights-to-extract AudioInsightsOnly
    
# </AmsTransformOutputAdd>

# <AmsTransformOutputRemove>
az ams transform output remove
    #type: command
    #short-summary: Remove an output from an existing transform.
    #examples:
        #- name: Remove the output element at the index specified with --output-index argument.
          #text: >
            #az ams transform output remove -a myAmsAccount -n transformName -g myResourceGroup --output-index 1

# </AmsTransformOutputRemove>

# <AmsAsset>
az ams asset
    #type: group
    #short-summary: Manage assets for an Azure Media Services account.

# </AmsAsset>

# <AmsAssetFilter>
az ams asset-filter
    #type: group
    #short-summary: Manage asset filters for an Azure Media Services account.

# </AmsAssetFilter>

# <AmsAccountFilter>
az ams account-filter
    #type: group
    #short-summary: Manage account filters for an Azure Media Services account.

# </AmsAccountFilter>

# <AmsAssetShow>
az ams asset show
    #type: command
    #short-summary: Show the details of an asset.

# </AmsAssetShow>

# <AmsAssetList>
az ams asset list
    #type: command
    #short-summary: List all the assets of an Azure Media Services account.
    #examples:
        #- name: List all the assets whose names start with the string 'Something'.
          #text: >
            #az ams asset list -a amsAccount -g resourceGroup --query [?starts_with(name,'Something')]

# </AmsAssetList>

# <AmsAssetListStreamingLocators>
az ams asset list-streaming-locators
    #type: command
    #short-summary: List streaming locators which are associated with this asset.

# </AmsAssetListStreamingLocators>

# <AmsAssetCreate>
az ams asset create
    #type: command
    #short-summary: Create an asset.

# </AmsAssetCreate>

# <AmsAssetUpdate>
az ams asset update
    #type: command
    #short-summary: Update the details of an asset.

# </AmsAssetUpdate>

# <AmsAssetDelete>
az ams asset delete
    #type: command
    #short-summary: Delete an asset.

# </AmsAssetDelete>

# <AmsAssetGetSASUrls>
az ams asset get-sas-urls
    #type: command
    #short-summary: Lists storage container URLs with shared access signatures (SAS) for uploading and downloading Asset content. The signatures are derived from the storage account keys.

# </AmsAssetGetSASUrls>

# <AmsAssetGetEncryptionKey>
az ams asset get-encryption-key
    #type: command
    #short-summary: Get the asset storage encryption keys used to decrypt content created by version 2 of the Media Services API.

# </AmsAssetGetEncryptionKey>

# <AmsAssetFilterCreate>
az ams asset-filter create
    #type: command
    #short-summary: Create an asset filter.
    #examples:
        #- name: Create an asset filter with filter track selections.
          #text: >
            #az ams asset-filter create -a amsAccount -g resourceGroup -n filterName --force-end-timestamp=False --end-timestamp 200000 --start-timestamp 100000 --live-backoff-duration 60 --presentation-window-duration 600000 --timescale 1000 --first-quality 720 --asset-name assetName --tracks @C:\\tracks.json

# </AmsAssetFilterCreate>

# <AmsAssetFilterUpdate>
az ams asset-filter update
    #type: command
    #short-summary: Update the details of an asset filter.

# </AmsAssetFilterUpdate>

# <AmsAssetFilterDelete>
az ams asset-filter delete
    #type: command
    #short-summary: Delete an asset filter.

# </AmsAssetFilterDelete>

# <AmsAssetFilterList>
az ams asset-filter list
    #type: command
    #short-summary: List all the asset filters of an Azure Media Services account.

# </AmsAssetFilterList>

# <AmsAssetFilterShow>
az ams asset-filter show
    #type: command
    #short-summary: Show the details of an asset filter.

# </AmsAssetFilterShow>

# <AmsContentKeyPolicy>
az ams content-key-policy
    #type: group
    #short-summary: Manage content key policies for an Azure Media Services account.

# </AmsContentKeyPolicy>

# <AmsContentKeyPolicyCreate>
az ams content-key-policy create
    #type: command
    #short-summary: Create a new content key policy.
    #examples:
        #- name: Create an content-key-policy with a FairPlay Configuration.
          #text: >
            #az ams content-key-policy create -a amsAccount -g resourceGroup -n contentKeyPolicyName --policy-option-name policyOptionName --open-restriction --ask "ask-32-chars-hex-string" --fair-play-pfx pfxPath --fair-play-pfx-password "pfxPassword" --rental-and-lease-key-type PersistentUnlimited --rental-duration 5000

# </AmsContentKeyPolicyCreate>

# <AmsContentKeyPolicyShow>
az ams content-key-policy show
    #type: command
    #short-summary: Show an existing content key policy.

# </AmsContentKeyPolicyShow>

# <AmsContentKeyPolicyDelete>
az ams content-key-policy delete
    #type: command
    #short-summary: Delete a content key policy.

# </AmsContentKeyPolicyDelete>

# <AmsContentKeyPolicyUpdate>
az ams content-key-policy update
    #type: command
    #short-summary: Update an existing content key policy.
    #examples:
        #- name: Update an existing content-key-policy, set a new description and edit its first option setting a new issuer and audience.
          #text: >
            #az ams content-key-policy update -n contentKeyPolicyName -a amsAccount --description newDescription --set options[0].restriction.issuer=newIssuer --set options[0].restriction.audience=newAudience

# </AmsContentKeyPolicyUpdate>

# <AmsContentKeyPolicyList>
az ams content-key-policy list
    #type: command
    #short-summary: List all the content key policies within an Azure Media Services account.

# </AmsContentKeyPolicyList>

# <AmsContentKeyPolicyOption>
az ams content-key-policy option
    #type: group
    #short-summary: Manage options for an existing content key policy.

# </AmsContentKeyPolicyOption>

# <AmsContentKeyPolicyOptionAdd>
az ams content-key-policy option add
    #type: command
    #short-summary: Add a new option to an existing content key policy.

# </AmsContentKeyPolicyOptionAdd>

#type: command
#short-summary: Remove an option from an existing content key policy.
# <AmsContentKeyPolicyOptionRemove>
az ams content-key-policy option remove
# </AmsContentKeyPolicyOptionRemove>

# <AmsContentKeyPolicyOptionUpdate>
az ams content-key-policy option update
    #type: command
    #short-summary: Update an option from an existing content key policy.
    #examples:
        #- name: Update an existing content-key-policy by adding an alternate token key to an existing option.
          #text: >
            #az ams content-key-policy option update -n contentKeyPolicyName -g resourceGroup -a amsAccount --policy-option-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --add-alt-token-key tokenKey --add-alt-token-key-type Symmetric

# </AmsContentKeyPolicyOptionUpdate>

# <AmsJob>
az ams job
    #type: group
    #short-summary: Manage jobs for a transform.

# </AmsJob>

# <AmsJobStart>
az ams job start
    #type: command
    #short-summary: Start a job.

# </AmsJobStart>

# <AmsJobUpdate>
az ams job update
    #type: command
    #short-summary: Update an existing job.
# </AmsJobUpdate>

# <AmsJobList>
az ams job list
    #type: command
    #short-summary: List all the jobs of a transform within an Azure Media Services account.
    #examples:
        #- name: List all the jobs of a transform with 'Normal' priority by name.
          #text: >
            #az ams job list -a amsAccount -g resourceGroup -t transformName --query [?priority=='Normal'].{jobName:name}
        #- name: List all the jobs of a transform by name and input.
          #text: >
            #az ams job list -a amsAccount -g resourceGroup -t transformName --query [].{jobName:name,jobInput:input}
# </AmsJobList>

# <AmsJobShow>
az ams job show
    #type: command
    #short-summary: Show the details of a job.
# </AmsJobShow>

# <AmsJobDelete>
az ams job delete
    #type: command
    #short-summary: Delete a job.
# </AmsJobDelete>

# <AmsJobCancel>
az ams job cancel
    #type: command
    #short-summary: Cancel a job.
# </AmsJobCancel>

# <AmsStreamingLocator>
az ams streaming-locator
    #type: group
    #short-summary: Manage streaming locators for an Azure Media Services account.
# </AmsStreamingLocator>

# <AmsStreamingLocatorCreate>
az ams streaming-locator create
    #type: command
    #short-summary: Create a streaming locator.
# </AmsStreamingLocatorCreate>

# <AmsStreamingLocatorList>
az ams streaming-locator list
    #type: command
    #short-summary: List all the streaming locators within an Azure Media Services account.
# </AmsStreamingLocatorList>

# <AmsStreamingLocatorShow>
az ams streaming-locator show
    #type: command
    #short-summary: Show the details of a streaming locator.
# </AmsStreamingLocatorShow>

# <AmsStreamingLocatorGetPaths>
az ams streaming-locator get-paths
    #type: command
    #short-summary: List paths supported by a streaming locator.
# </AmsStreamingLocatorGetPaths>

# <AmsStreamingLocatorListContentKeys>
az ams streaming-locator list-content-keys
    #type: command
    #short-summary: List content keys used by a streaming locator.
# </AmsStreamingLocatorListContentKeys>

# <AmsStreamingPolicy>
az ams streaming-policy
    #type: group
    #short-summary: Manage streaming policies for an Azure Media Services account.
# </AmsStreamingPolicy>

# <AmsStreamingPolicyCreate>
az ams streaming-policy create
    #type: command
    #short-summary: Create a streaming policy.
# </AmsStreamingPolicyCreate>

# <AmsStreamingPolicyList>
az ams streaming-policy list
    #type: command
    #short-summary: List all the streaming policies within an Azure Media Services account.
# </AmsStreamingPolicyList>

# <AmsStreamingPolicyShow>
az ams streaming-policy show
    #type: command
    #short-summary: Show the details of a streaming policy.
# </AmsStreamingPolicyShow>

# <AmsStreamingEndpointShow>
az ams streaming-endpoint
    #type: group
    #short-summary: Manage streaming endpoints for an Azure Media Service account.
# </AmsStreamingEndpointShow>

# <AmsStreamingEndpointStart>
az ams streaming-endpoint start
    #type: command
    #short-summary: Start a streaming endpoint.
# </AmsStreamingEndpointStart>

# <AmsStreamingEndpointStop>
az ams streaming-endpoint stop
    #type: command
    #short-summary: Stop a streaming endpoint.
# </AmsStreamingEndpointStop>

# <AmsStreamingEndpointList>
az ams streaming-endpoint list
    #type: command
    #short-summary: List all the streaming endpoints within an Azure Media Services account.
# </AmsStreamingEndpointList>

# <AmsStreamingEndpointCreate>
az ams streaming-endpoint create
    #type: command
    #short-summary: Create a streaming endpoint.
# </AmsStreamingEndpointCreate>

# <AmsStreamingEndpointWait>
az ams streaming-endpoint wait
    #type: command
    #short-summary: Place the CLI in a waiting state until a condition of the streaming endpoint is met.
    #examples:
        #- name: Place the CLI in a waiting state until the streaming endpoint is created.
          #text: az ams streaming-endpoint wait -g MyResourceGroup -a MyAmsAccount -n MyStreamingEndpoint --created
# </AmsStreamingEndpointWait>

# <AmsStreamingEndpointAkamai>
az ams streaming-endpoint akamai
    #type: group
    #short-summary: Manage AkamaiAccessControl objects to be used on streaming endpoints.
# </AmsStreamingEndpointAkamai>

# <AmsStreamingEndpointAkamaiAdd>
az ams streaming-endpoint akamai add
    #type: command
    #short-summary: Add an AkamaiAccessControl to an existing streaming endpoint.

# </AmsStreamingEndpointAkamaiAdd>

# <AmsStreamingEndpointShow>
az ams streaming-endpoint show
    #type: command
    #short-summary: Show the details of a streaming endpoint.
# </AmsStreamingEndpointShow>

# <AmsStreamingEndpointDelete>
az ams streaming-endpoint delete
    #type: command
    #short-summary: Delete a streaming endpoint.
# </AmsStreamingEndpointDelete>

# <AmsStreamingEndpointAkamaiRemove>
az ams streaming-endpoint akamai remove
    #type: command
    #short-summary: Remove an AkamaiAccessControl from an existing streaming endpoint.
# </AmsStreamingEndpointAkamaiRemove>

# <AmsStreamingEndpointScale>
az ams streaming-endpoint scale
    #type: command
    #short-summary: Set the scale of a streaming endpoint.
# <AmsStreamingEndpointScale>

# <AmsStreamingEndpointUpdate>
az ams streaming-endpoint update
    #type: command
    #short-summary: Update the details of a streaming endpoint.
# </AmsStreamingEndpointUpdate>

# <AmsLiveEvent>
az ams live-event
    #type: group
    #short-summary: Manage live events for an Azure Media Service account.
# </AmsLiveEvent>

# <AmsLiveEventCreate>
az ams live-event create
    #type: command
    #short-summary: Create a live event.
# </AmsLiveEventCreate>

# <AmsLiveEventStart>
az ams live-event start
    #type: command
    #short-summary: Start a live event.
# </AmsLiveEventStart>

# <AmsLiveEventStandby>
az ams live-event standby
    #type: command
    #short-summary: Allocate a live event to be started later.
# </AmsLiveEventStandby>

# <AmsLiveEventShow>
az ams live-event show
    #type: command
    #short-summary: Show the details of a live event.
# </AmsLiveEventShow>

# <AmsLiveEventList>
az ams live-event list
    #type: command
    #short-summary: List all the live events of an Azure Media Services account.
    #examples:
        #- name: List all the live events by name and resourceState quickly.
          #text: >
            #az ams live-event list -a amsAccount -g resourceGroup --query [].{liveEventName:name,state:resourceState}
# </AmsLiveEventList>

# <AmsLiveEventDelete>
az ams live-event delete
    #type: command
    #short-summary: Delete a live event.
# </AmsLiveEventDelete>

# <AmsLiveEventStop>
az ams live-event stop
    #type: command
    #short-summary: Stop a live event.
# </AmsLiveEventStop>

# <AmsLiveEventReset>
az ams live-event reset
    #type: command
    #short-summary: Reset a live event.
# </AmsLiveEventReset>

# <AmsLiveEventUpdate>
az ams live-event update
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

# <AmsLiveEventWait>
az ams live-event wait
    #type: command
    #short-summary: Place the CLI in a waiting state until a condition of the live event is met.
    #examples:
        #- name: Place the CLI in a waiting state until the live event is created.
          #text: az ams live-event wait -g MyResourceGroup -a MyAmsAccount -n MyLiveEvent --created
# </AmsLiveEventWait>

# <AmsLiveEOutput>
az ams live-output
    #type: group
    #short-summary: Manage live outputs for an Azure Media Service account.
# </AmsLiveEOutput>

# <AmsLiveEOutputCreate>
az ams live-output create
    #type: command
    #short-summary: Create a live output.
# </AmsLiveEOutputCreate>

# <AmsLiveEOutputShow>
az ams live-output show
    #type: command
    #short-summary: Show the details of a live output.
# </AmsLiveEOutputShow>

az ams live-output list
    #type: command
    #short-summary: List all the live outputs in a live event.


az ams live-output delete
    #type: command
    #short-summary: Delete a live output.


az ams account-filter show
    #type: command
    #short-summary: Show the details of an account filter.


az ams account-filter list
    #type: command
    #short-summary: List all the account filters of an Azure Media Services account.


az ams account-filter create
    #type: command
    #short-summary: Create an account filter.
    #examples:
        #- name: Create an asset filter with filter track selections.
          #text: >
            #az ams account-filter create -a amsAccount -g resourceGroup -n filterName --force-end-timestamp=False --end-timestamp 200000 --start-timestamp 100000 --live-backoff-duration 60 --presentation-window-duration 600000 --timescale 1000 --first-quality 720 --tracks @C:\\tracks.json


az ams account-filter update
    #type: command
    #short-summary: Update the details of an account filter.


az ams account-filter delete
    #type: command
    #short-summary: Delete an account filter.


az ams account mru
    #type: group
    #short-summary: Manage media reserved units for an Azure Media Services account. This doesn't work with accounts created with 2020-05-01 version of the Media Services API or later. Accounts created this way no longer need to set media reserved units as the system will automaticaly scale up and down based on load.


az ams account mru set
    #type: command
    #short-summary: Set the type and number of media reserved units for an Azure Media Services account. This doesn't work with accounts created with 2020-05-01 version of the Media Services API or later. Accounts created this way no longer need to set media reserved units as the system will automaticaly scale up and down based on load.


az ams account mru show
    #type: command
    #short-summary: Show the details of media reserved units for an Azure Media Services account. This doesn't work with accounts created with 2020-05-01 version of the Media Services API or later. Accounts created this way no longer need to set media reserved units as the system will automaticaly scale up and down based on load.

