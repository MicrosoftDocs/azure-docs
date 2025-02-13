---
title: Azure permissions for AI + machine learning - Azure RBAC
description: Lists the permissions for the Azure resource providers in the AI + machine learning category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 01/25/2025
ms.custom: generated
---

# Azure permissions for AI + machine learning

This article lists the permissions for the Azure resource providers in the AI + machine learning category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## Microsoft.AgFoodPlatform

Azure service: [Microsoft Azure Data Manager for Agriculture](/azure/data-manager-for-agri/overview-azure-data-manager-for-agriculture)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AgFoodPlatform/register/action | Registers the subscription for the AgFoodPlatform Resource Provider. |
> | Microsoft.AgFoodPlatform/unregister/action | Unregisters the subscription for the AgFoodPlatform Resource Provider. |
> | Microsoft.AgFoodPlatform/checkNameAvailability/action | Checks that resource name is valid and is not in use. |
> | Microsoft.AgFoodPlatform/farmBeats/read | Gets or Lists existing AgFoodPlatform FarmBeats resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/write | Creates or Updates AgFoodPlatform FarmBeats. |
> | Microsoft.AgFoodPlatform/farmBeats/delete | Deletes an existing AgFoodPlatform FarmBeats resource. |
> | Microsoft.AgFoodPlatform/farmBeats/dataConnectors/read | Gets or Lists existing AgFoodPlatform DataConnectors resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/dataConnectors/write | Creates or Updates AgFoodPlatform DataConnectors. |
> | Microsoft.AgFoodPlatform/farmBeats/dataConnectors/delete | Deletes an existing AgFoodPlatform DataConnectors resource. |
> | Microsoft.AgFoodPlatform/farmBeats/eventGridFilters/read | Gets or Lists existing AgFoodPlatform Event Grid filters resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/eventGridFilters/write | Creates or Updates AgFoodPlatform Event Grid filters. |
> | Microsoft.AgFoodPlatform/farmBeats/eventGridFilters/delete | Deletes an existing AgFoodPlatform Event Grid filters resource. |
> | Microsoft.AgFoodPlatform/farmBeats/extensions/read | Gets or Lists existing AgFoodPlatform Extensions resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/extensions/write | Creates or Updates AgFoodPlatform Extensions. |
> | Microsoft.AgFoodPlatform/farmBeats/extensions/delete | Deletes an existing AgFoodPlatform Extensions resource. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnectionProxies/read | Gets or Lists existing AgFoodPlatform Private endpoint connection proxies resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnectionProxies/write | Creates or Updates AgFoodPlatform Private endpoint connection proxies. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnectionProxies/delete | Deletes an existing AgFoodPlatform Private endpoint connection proxies resource. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnectionProxies/validate/action | Validates AgFoodPlatform Private endpoint connection proxy resource. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnectionProxies/operationResults/read | Gets the result for a private endpoint connection proxy resource long running operation. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnections/read | Gets or Lists existing AgFoodPlatform Private endpoint connections resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnections/write | Creates or Updates AgFoodPlatform Private endpoint connections. |
> | Microsoft.AgFoodPlatform/farmBeats/privateEndpointConnections/delete | Deletes an existing AgFoodPlatform Private endpoint connections resource. |
> | Microsoft.AgFoodPlatform/farmBeats/privateLinkResources/read | Gets or Lists existing AgFoodPlatform Private link resources resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/solutions/read | Gets or Lists existing AgFoodPlatform add-ons resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/solutions/write | Creates or Updates AgFoodPlatform add-ons. |
> | Microsoft.AgFoodPlatform/farmBeats/solutions/delete | Deletes an existing AgFoodPlatform add-ons resource. |
> | Microsoft.AgFoodPlatform/farmBeatsExtensionDefinitions/read | Gets or Lists existing AgFoodPlatform FarmBeatsExtensionDefinitions resource(s). |
> | Microsoft.AgFoodPlatform/farmBeatsSolutionDefinitions/read | Gets or Lists existing AgFoodPlatform FarmBeatsSolutionDefinitions resource(s). |
> | Microsoft.AgFoodPlatform/locations/operationResults/read | Returns result of async operation in Microsoft AgFoodPlatform resource provider. |
> | Microsoft.AgFoodPlatform/operations/read | List all operations in Microsoft AgFoodPlatform resource provider. |
> | **DataAction** | **Description** |
> | Microsoft.AgFoodPlatform/farmBeats/applicationData/list/action | List(s) existing AgFoodPlatform application operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/applicationData/search/action | Searches existing AgFoodPlatform application operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/boundaries/list/action | List(s) existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/boundaries/search/action | Searches existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/chemicalProducts/read | Gets or Lists existing AgFoodPlatform Chemical Products resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/chemicalProducts/write | Creates or Updates AgFoodPlatform Chemical Products. |
> | Microsoft.AgFoodPlatform/farmBeats/chemicalProducts/list/action | Deletes an existing AgFoodPlatform Chemical Products resource. |
> | Microsoft.AgFoodPlatform/farmBeats/chemicalProducts/delete | List(s) existing AgFoodPlatform Chemical Product resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/cropProducts/read | Gets or Lists existing AgFoodPlatform cropProducts resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/cropProducts/write | Creates or Updates AgFoodPlatform cropProducts. |
> | Microsoft.AgFoodPlatform/farmBeats/cropProducts/delete | Deletes an existing AgFoodPlatform cropProducts resource. |
> | Microsoft.AgFoodPlatform/farmBeats/cropProducts/list/action | List(s) existing AgFoodPlatform Crop Product. resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/crops/read | Gets or Lists existing AgFoodPlatform crops resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/crops/write | Creates or Updates AgFoodPlatform crops. |
> | Microsoft.AgFoodPlatform/farmBeats/crops/delete | Deletes an existing AgFoodPlatform crops resource. |
> | Microsoft.AgFoodPlatform/farmBeats/crops/list/action | List(s) existing AgFoodPlatform crop resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/cropVarieties/read | Gets or Lists existing AgFoodPlatform crop varieties resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/cropVarieties/write | Creates or Updates AgFoodPlatform crop varieties. |
> | Microsoft.AgFoodPlatform/farmBeats/cropVarieties/delete | Deletes an existing AgFoodPlatform crop varieties resource. |
> | Microsoft.AgFoodPlatform/farmBeats/cropVarieties/list/action | List(s) existing AgFoodPlatform crop variety resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasetRecords/read | Gets or Lists existing AgFoodPlatform Dataset Records resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasetRecords/write | Creates or Updates AgFoodPlatform Dataset Records. |
> | Microsoft.AgFoodPlatform/farmBeats/datasetRecords/delete | Deletes an existing AgFoodPlatform Dataset Records resource. |
> | Microsoft.AgFoodPlatform/farmBeats/datasetRecords/list/action | List(s) existing AgFoodPlatform dataset record resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/read | Gets or Lists existing AgFoodPlatform datasets resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/write | Creates or Updates AgFoodPlatform datasets. |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/delete | Deletes an existing AgFoodPlatform datasets resource. |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/list/action | List(s) existing AgFoodPlatform dataset resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/publish/action | List(s) existing AgFoodPlatform DatasetAccess resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/access/list/action | Gets or Lists existing AgFoodPlatform DatasetAccesses resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/access/grant/action | Creates or Updates AgFoodPlatform DatasetAccesses. |
> | Microsoft.AgFoodPlatform/farmBeats/datasets/access/remove/action | Deletes an existing AgFoodPlatform DatasetAccesses resource. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/applicationDataCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform applicationDataCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/applicationDataCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform applicationDataCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/boundariesCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform boundariesCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/boundariesCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform boundariesCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/farmersCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform farmersCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/farmersCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform farmersCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/farmsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform farmsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/farmsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform farmsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/fieldsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform fieldsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/fieldsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform fieldsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/harvestDataCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform harvestDataCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/harvestDataCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform harvestDataCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/insightsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform insightsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/insightsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform insightsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/managementZonesCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform managementZonesCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/managementZonesCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform managementZonesCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/oauthProvidersCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform oauthProvidersCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/oauthProvidersCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform oauthProvidersCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/oauthTokensRemoveJobs/read | Gets or Lists existing AgFoodPlatform oauth tokens resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/oauthTokensRemoveJobs/write | Creates or Updates AgFoodPlatform oauth tokens. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/partiesCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform partiesCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/partiesCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform partiesCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/plantingDataCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform plantingDataCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/plantingDataCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform plantingDataCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/plantTissueAnalysesCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform plantTissueAnalysesCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/plantTissueAnalysesCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform plantTissueAnalysesCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/prescriptionMapsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform prescriptionMapsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/prescriptionMapsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform prescriptionMapsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/prescriptionsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform prescriptionsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/prescriptionsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform prescriptionsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/seaonalFieldsCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform seaonalFieldsCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/seaonalFieldsCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform seaonalFieldsCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/tillageDataCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform tillageDataCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/tillageDataCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform tillageDataCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/weatherDataDeletionJobs/read | Gets or Lists existing AgFoodPlatform weatherDataDeletionJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/weatherDataDeletionJobs/write | Creates or Updates AgFoodPlatform weatherDataDeletionJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/zonesCascadeDeleteJobs/read | Gets or Lists existing AgFoodPlatform zonesCascadeDeleteJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/deletionJobs/zonesCascadeDeleteJobs/write | Creates or Updates AgFoodPlatform zonesCascadeDeleteJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/farmEquipments/read | Gets or Lists existing AgFoodPlatform Farm Equipments resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmEquipments/write | Creates or Updates AgFoodPlatform Farm Equipments. |
> | Microsoft.AgFoodPlatform/farmBeats/farmEquipments/list/action | Deletes an existing AgFoodPlatform Farm Equipments resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmEquipments/delete | List(s) existing AgFoodPlatform Farm Equipment resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/read | Gets or Lists existing AgFoodPlatform farmers resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/write | Creates or Updates AgFoodPlatform farmers. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/delete | Deletes an existing AgFoodPlatform farmers resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/list/action | List(s) existing AgFoodPlatform farmer resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/applicationData/read | Gets or Lists existing AgFoodPlatform application operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/applicationData/write | Creates or Updates AgFoodPlatform application operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/applicationData/delete | Deletes an existing AgFoodPlatform application operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/applicationData/list/action | List(s) existing AgFoodPlatform application operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/attachments/read | Gets or Lists existing AgFoodPlatform attachments resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/attachments/write | Creates or Updates AgFoodPlatform attachments. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/attachments/delete | Deletes an existing AgFoodPlatform attachments resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/attachments/list/action | List(s) existing AgFoodPlatform attachment resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/attachments/download/action | boundaries Download |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/read | Gets or Lists existing AgFoodPlatform boundaries resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/write | Creates or Updates AgFoodPlatform boundaries. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/delete | Deletes an existing AgFoodPlatform boundaries resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/list/action | List(s) existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/search/action | Searches existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/boundaries/overlap/action | Boundary Overlap. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/farms/read | Gets or Lists existing AgFoodPlatform farms resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/farms/write | Creates or Updates AgFoodPlatform farms. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/farms/delete | Deletes an existing AgFoodPlatform farms resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/farms/list/action | List(s) existing AgFoodPlatform farm resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/fields/read | Gets or Lists existing AgFoodPlatform fields resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/fields/write | Creates or Updates AgFoodPlatform fields. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/fields/delete | Deletes an existing AgFoodPlatform fields resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/fields/list/action | List(s) existing AgFoodPlatform field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/harvestData/read | Gets or Lists existing AgFoodPlatform harvest operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/harvestData/write | Creates or Updates AgFoodPlatform harvest operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/harvestData/delete | Deletes an existing AgFoodPlatform harvest operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/harvestData/list/action | List(s) existing AgFoodPlatform harvest operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insightAttachments/read | Gets or Lists existing AgFoodPlatform insight attachments resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insightAttachments/write | Creates or Updates AgFoodPlatform insight attachments. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insightAttachments/delete | Deletes an existing AgFoodPlatform insight attachments resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insightAttachments/list/action | List(s) existing AgFoodPlatform insight attachment resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insightAttachments/download/action | insights Download |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insights/read | Gets or Lists existing AgFoodPlatform insights resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insights/write | Creates or Updates AgFoodPlatform insights. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insights/delete | Deletes an existing AgFoodPlatform insights resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/models/resourceTypes/resources/insights/list/action | List(s) existing AgFoodPlatform insight resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/nutrientAnalyses/read | Gets or Lists existing AgFoodPlatform nutrient analyses resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/nutrientAnalyses/write | Creates or Updates AgFoodPlatform nutrient analyses. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/nutrientAnalyses/delete | Deletes an existing AgFoodPlatform nutrient analyses resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/nutrientAnalyses/list/action | List(s) existing AgFoodPlatform nutrient analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantingData/read | Gets or Lists existing AgFoodPlatform planting operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantingData/write | Creates or Updates AgFoodPlatform planting operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantingData/delete | Deletes an existing AgFoodPlatform planting operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantingData/list/action | List(s) existing AgFoodPlatform planting operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantTissueAnalyses/read | Gets or Lists existing AgFoodPlatform plant tissue analyses resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantTissueAnalyses/write | Creates or Updates AgFoodPlatform plant tissue analyses. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantTissueAnalyses/delete | Deletes an existing AgFoodPlatform plant tissue analyses resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/plantTissueAnalyses/list/action | List(s) existing AgFoodPlatform plant tissue analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptionMaps/read | Gets or Lists existing AgFoodPlatform prescription maps resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptionMaps/write | Creates or Updates AgFoodPlatform prescription maps. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptionMaps/delete | Deletes an existing AgFoodPlatform prescription maps resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptionMaps/list/action | List(s) existing AgFoodPlatform prescription map resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptions/read | Gets or Lists existing AgFoodPlatform prescriptions resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptions/write | Creates or Updates AgFoodPlatform prescriptions. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptions/delete | Deletes an existing AgFoodPlatform prescriptions resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/prescriptions/list/action | List(s) existing AgFoodPlatform prescription resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/seasonalFields/read | Gets or Lists existing AgFoodPlatform seasonal fields resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/seasonalFields/write | Creates or Updates AgFoodPlatform seasonal fields. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/seasonalFields/delete | Deletes an existing AgFoodPlatform seasonal fields resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/seasonalFields/list/action | List(s) existing AgFoodPlatform seasonal field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/tillageData/read | Gets or Lists existing AgFoodPlatform tillage operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/tillageData/write | Creates or Updates AgFoodPlatform tillage operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/tillageData/delete | Deletes an existing AgFoodPlatform tillage operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/tillageData/list/action | List(s) existing AgFoodPlatform tillage operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/zones/read | Gets or Lists existing AgFoodPlatform zones resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/zones/write | Creates or Updates AgFoodPlatform zones. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/zones/delete | Deletes an existing AgFoodPlatform zones resource. |
> | Microsoft.AgFoodPlatform/farmBeats/farmers/zones/list/action | List(s) existing AgFoodPlatform zone resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/farms/list/action | List(s) existing AgFoodPlatform farm resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/fields/list/action | List(s) existing AgFoodPlatform field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/fields/search/action | Searches existing AgFoodPlatform field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/harvestData/list/action | List(s) existing AgFoodPlatform harvest operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/harvestData/search/action | Searches existing AgFoodPlatform harvest operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/biomassModelJobs/read | Gets or Lists existing AgFoodPlatform biomassModelJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/biomassModelJobs/write | Creates or Updates AgFoodPlatform biomassModelJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/farmOperationDataIngestionJobs/read | Gets or Lists existing AgFoodPlatform farmOperationDataIngestionJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/farmOperationDataIngestionJobs/write | Creates or Updates AgFoodPlatform farmOperationDataIngestionJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/imageProcessingRasterizeJobs/read | Gets or Lists existing AgFoodPlatform imageProcessingRasterizeJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/imageProcessingRasterizeJobs/write | Creates or Updates AgFoodPlatform imageProcessingRasterizeJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/satelliteDataIngestionJobs/read | Gets or Lists existing AgFoodPlatform satelliteDataIngestionJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/satelliteDataIngestionJobs/write | Creates or Updates AgFoodPlatform satelliteDataIngestionJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/sensorPlacementModelJobs/read | Gets or Lists existing AgFoodPlatform sensorPlacementModelJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/sensorPlacementModelJobs/write | Creates or Updates AgFoodPlatform sensorPlacementModelJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/soilMoistureModelJobs/read | Gets or Lists existing AgFoodPlatform soilMoistureModelJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/soilMoistureModelJobs/write | Creates or Updates AgFoodPlatform soilMoistureModelJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/solutions/read | Gets or Lists existing AgFoodPlatform add-ons resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/solutions/write | Creates or Updates AgFoodPlatform add-ons. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/solutions/cancel/action | Cancels an existing AgFoodPlatform add-on. |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/weatherDataIngestionJobs/read | Gets or Lists existing AgFoodPlatform weatherDataIngestionJobs resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/ingestionJobs/weatherDataIngestionJobs/write | Creates or Updates AgFoodPlatform weatherDataIngestionJobs. |
> | Microsoft.AgFoodPlatform/farmBeats/nutrientAnalyses/list/action | List(s) existing AgFoodPlatform nutrient analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/oauthProviders/read | Gets or Lists existing AgFoodPlatform oauth providers resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/oauthProviders/write | Creates or Updates AgFoodPlatform oauth providers. |
> | Microsoft.AgFoodPlatform/farmBeats/oauthProviders/delete | Deletes an existing AgFoodPlatform oauth providers resource. |
> | Microsoft.AgFoodPlatform/farmBeats/oauthProviders/list/action | List(s) existing AgFoodPlatform oauth provider resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/oauthTokens/read | Gets or Lists existing AgFoodPlatform oauth tokens resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/oauthTokens/write | Creates or Updates AgFoodPlatform oauth tokens. |
> | Microsoft.AgFoodPlatform/farmBeats/oauthTokens/delete | Deletes an existing AgFoodPlatform oauth tokens resource. |
> | Microsoft.AgFoodPlatform/farmBeats/oauthTokens/list/action | List(s) existing AgFoodPlatform oauth token resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/read | Gets or Lists existing AgFoodPlatform parties resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/write | Creates or Updates AgFoodPlatform parties. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/delete | Deletes an existing AgFoodPlatform parties resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/list/action | List(s) existing AgFoodPlatform Party resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/overlap/action | Searches existing AgFoodPlatform Party resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/applicationData/read | Gets or Lists existing AgFoodPlatform application operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/applicationData/write | Creates or Updates AgFoodPlatform application operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/applicationData/delete | Deletes an existing AgFoodPlatform application operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/applicationData/list/action | List(s) existing AgFoodPlatform application operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/attachments/read | Gets or Lists existing AgFoodPlatform attachments resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/attachments/write | Creates or Updates AgFoodPlatform attachments. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/attachments/delete | Deletes an existing AgFoodPlatform attachments resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/attachments/list/action | List(s) existing AgFoodPlatform attachment resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/attachments/download/action | boundaries Download |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/read | Gets or Lists existing AgFoodPlatform boundaries resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/write | Creates or Updates AgFoodPlatform boundaries. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/delete | Deletes an existing AgFoodPlatform boundaries resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/list/action | List(s) existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/search/action | Searches existing AgFoodPlatform boundary resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/boundaries/overlap/action | Boundary Overlap. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/farms/read | Gets or Lists existing AgFoodPlatform farms resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/farms/write | Creates or Updates AgFoodPlatform farms. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/farms/delete | Deletes an existing AgFoodPlatform farms resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/farms/list/action | List(s) existing AgFoodPlatform farm resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/fields/read | Gets or Lists existing AgFoodPlatform fields resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/fields/write | Creates or Updates AgFoodPlatform fields. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/fields/delete | Deletes an existing AgFoodPlatform fields resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/fields/list/action | List(s) existing AgFoodPlatform field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/harvestData/read | Gets or Lists existing AgFoodPlatform harvest operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/harvestData/write | Creates or Updates AgFoodPlatform harvest operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/harvestData/delete | Deletes an existing AgFoodPlatform harvest operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/harvestData/list/action | List(s) existing AgFoodPlatform harvest operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insightAttachments/read | Gets or Lists existing AgFoodPlatform insight attachments resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insightAttachments/write | Creates or Updates AgFoodPlatform insight attachments. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insightAttachments/delete | Deletes an existing AgFoodPlatform insight attachments resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insightAttachments/list/action | List(s) existing AgFoodPlatform insight attachment resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insightAttachments/download/action | insights Download |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insights/read | Gets or Lists existing AgFoodPlatform insights resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insights/write | Creates or Updates AgFoodPlatform insights. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insights/delete | Deletes an existing AgFoodPlatform insights resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/models/resourceTypes/resources/insights/list/action | List(s) existing AgFoodPlatform insight resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/nutrientAnalyses/read | Gets or Lists existing AgFoodPlatform nutrient analyses resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/nutrientAnalyses/write | Creates or Updates AgFoodPlatform nutrient analyses. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/nutrientAnalyses/delete | Deletes an existing AgFoodPlatform nutrient analyses resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/nutrientAnalyses/list/action | List(s) existing AgFoodPlatform nutrient analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantingData/read | Gets or Lists existing AgFoodPlatform planting operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantingData/write | Creates or Updates AgFoodPlatform planting operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantingData/delete | Deletes an existing AgFoodPlatform planting operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantingData/list/action | List(s) existing AgFoodPlatform planting operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantTissueAnalyses/read | Gets or Lists existing AgFoodPlatform plant tissue analyses resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantTissueAnalyses/write | Creates or Updates AgFoodPlatform plant tissue analyses. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantTissueAnalyses/delete | Deletes an existing AgFoodPlatform plant tissue analyses resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/plantTissueAnalyses/list/action | List(s) existing AgFoodPlatform plant tissue analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptionMaps/read | Gets or Lists existing AgFoodPlatform prescription maps resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptionMaps/write | Creates or Updates AgFoodPlatform prescription maps. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptionMaps/delete | Deletes an existing AgFoodPlatform prescription maps resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptionMaps/list/action | List(s) existing AgFoodPlatform prescription map resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptions/read | Gets or Lists existing AgFoodPlatform prescriptions resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptions/write | Creates or Updates AgFoodPlatform prescriptions. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptions/delete | Deletes an existing AgFoodPlatform prescriptions resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/prescriptions/list/action | List(s) existing AgFoodPlatform prescription resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/seasonalFields/read | Gets or Lists existing AgFoodPlatform seasonal fields resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/seasonalFields/write | Creates or Updates AgFoodPlatform seasonal fields. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/seasonalFields/delete | Deletes an existing AgFoodPlatform seasonal fields resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/seasonalFields/list/action | List(s) existing AgFoodPlatform seasonal field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/tillageData/read | Gets or Lists existing AgFoodPlatform tillage operations data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/tillageData/write | Creates or Updates AgFoodPlatform tillage operations data. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/tillageData/delete | Deletes an existing AgFoodPlatform tillage operations data resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/tillageData/list/action | List(s) existing AgFoodPlatform tillage operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/zones/read | Gets or Lists existing AgFoodPlatform zones resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/parties/zones/write | Creates or Updates AgFoodPlatform zones. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/zones/delete | Deletes an existing AgFoodPlatform zones resource. |
> | Microsoft.AgFoodPlatform/farmBeats/parties/zones/list/action | List(s) existing AgFoodPlatform zone resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/plantingData/list/action | List(s) existing AgFoodPlatform planting operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/plantingData/search/action | Searches existing AgFoodPlatform planting operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/plantTissueAnalyses/list/action | List(s) existing AgFoodPlatform plant tissue analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/plantTissueAnalyses/search/action | Searches existing AgFoodPlatform plant tissue analysis resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/prescriptionMaps/list/action | List(s) existing AgFoodPlatform prescription map resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/prescriptions/list/action | List(s) existing AgFoodPlatform prescription resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/prescriptions/search/action | Searches existing AgFoodPlatform prescription resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/scenes/read | Gets or Lists existing AgFoodPlatform scenes resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/scenes/write | Creates or Updates AgFoodPlatform scenes. |
> | Microsoft.AgFoodPlatform/farmBeats/scenes/delete | Deletes an existing AgFoodPlatform scenes resource. |
> | Microsoft.AgFoodPlatform/farmBeats/scenes/list/action | List(s) existing AgFoodPlatform scene resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/scenes/download/action | scenes Download |
> | Microsoft.AgFoodPlatform/farmBeats/seasonalFields/list/action | List(s) existing AgFoodPlatform seasonal field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/seasonalFields/search/action | Searches existing AgFoodPlatform seasonal field resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/seasons/read | Gets or Lists existing AgFoodPlatform seasons resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/seasons/write | Creates or Updates AgFoodPlatform seasons. |
> | Microsoft.AgFoodPlatform/farmBeats/seasons/delete | Deletes an existing AgFoodPlatform seasons resource. |
> | Microsoft.AgFoodPlatform/farmBeats/seasons/list/action | List(s) existing AgFoodPlatform season resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorData/list/action | Gets or Lists existing AgFoodPlatform sensor data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorMappings/read | Gets or Lists existing AgFoodPlatform sensor mappings resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorMappings/write | Creates or Updates AgFoodPlatform sensor mappings. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorMappings/delete | Deletes an existing AgFoodPlatform sensor mappings resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorMappings/list/action | List(s) existing AgFoodPlatform sensor mapping resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/deviceDataModels/read | Gets or Lists existing AgFoodPlatform device data models resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/deviceDataModels/write | Creates or Updates AgFoodPlatform device data models. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/deviceDataModels/delete | Deletes an existing AgFoodPlatform device data models resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/deviceDataModels/list/action | List(s) existing AgFoodPlatform device data model resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/devices/read | Gets or Lists existing AgFoodPlatform devices resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/devices/write | Creates or Updates AgFoodPlatform devices. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/devices/delete | Deletes an existing AgFoodPlatform devices resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/devices/list/action | List(s) existing AgFoodPlatform device resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/read | Gets or Lists existing AgFoodPlatform sensor partner integrations resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/write | Creates or Updates AgFoodPlatform sensor partner integrations. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/delete | Deletes an existing AgFoodPlatform sensor partner integrations resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/list/action | List(s) existing AgFoodPlatform sensor partner integration resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/checkConsent/action | Check consent |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/integrations/generateConsent/action | Generate consent |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensorDataModels/read | Gets or Lists existing AgFoodPlatform sensor data models resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensorDataModels/write | Creates or Updates AgFoodPlatform sensor data models. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensorDataModels/delete | Deletes an existing AgFoodPlatform sensor data models resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensorDataModels/list/action | List(s) existing AgFoodPlatform sensor data model resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/read | Gets or Lists existing AgFoodPlatform sensors resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/write | Creates or Updates AgFoodPlatform sensors. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/delete | Deletes an existing AgFoodPlatform sensors resource. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/list/action | List(s) existing AgFoodPlatform sensor resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/connectionStrings/read | Gets or Lists existing AgFoodPlatform ConnnectionStrings for Sensor Partners resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartners/sensors/connectionStrings/write | Creates or Updates AgFoodPlatform ConnnectionStrings for Sensor Partners. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/deviceDataModels/read | Get or List AgFoodPlatform device data models resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/deviceDataModels/write | Creates or Updates AgFoodPlatform device data models restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/deviceDataModels/delete | Deletes an existing AgFoodPlatform device data models resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/deviceDataModels/list/action | Lists an existing AgFoodPlatform device data models resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/devices/read | Get or List AgFoodPlatform devices resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/devices/write | Creates or Updates AgFoodPlatform devices restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/devices/delete | Deletes an existing AgFoodPlatform devices resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/devices/list/action | Lists an existing AgFoodPlatform devices resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorDataModels/read | Get or List AgFoodPlatform sensor data models resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorDataModels/write | Creates or Updates AgFoodPlatform sensor data models restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorDataModels/delete | Deletes an existing AgFoodPlatform sensor data models resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorDataModels/list/action | Lists an existing AgFoodPlatform sensor data models resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorPartnerIntegrationConsentLinkModels/read | Get or List AgFoodPlatform sensor partner integration consent links resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensors/read | Get or List AgFoodPlatform sensors resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensors/write | Creates or Updates AgFoodPlatform sensors restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensors/delete | Deletes an existing AgFoodPlatform sensors resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensors/list/action | Lists an existing AgFoodPlatform sensors resource restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorsconnectionStrings/read | Get or List AgFoodPlatform ConnnectionString for Sensor Partners resource(s) restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/sensorPartnerScope/sensorsconnectionStrings/write | Creates or Updates AgFoodPlatform ConnnectionString for Sensor Partners restricted to caller's sensor partner scope. |
> | Microsoft.AgFoodPlatform/farmBeats/stacFeatures/read | Gets or Lists existing AgFoodPlatform stacFeatures resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/stacFeatures/search/action | Searches existing AgFoodPlatform Stac Feature resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/tillageData/list/action | List(s) existing AgFoodPlatform tillage operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/tillageData/search/action | Searches existing AgFoodPlatform tillage operation data resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/weather/read | Gets or Lists existing AgFoodPlatform weather resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/weather/write | Creates or Updates AgFoodPlatform weather. |
> | Microsoft.AgFoodPlatform/farmBeats/weather/delete | Deletes an existing AgFoodPlatform weather resource. |
> | Microsoft.AgFoodPlatform/farmBeats/weather/list/action | List(s) existing AgFoodPlatform weather resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/zones/list/action | List(s) existing AgFoodPlatform zone resource(s). |
> | Microsoft.AgFoodPlatform/farmBeats/zones/search/action | Searches existing AgFoodPlatform zone resource(s). |
> | Microsoft.AgFoodPlatform/farmers/farmers/managementZones/read | Gets or Lists existing AgFoodPlatform management zones resource(s). |
> | Microsoft.AgFoodPlatform/farmers/farmers/managementZones/write | Creates or Updates AgFoodPlatform management zones. |
> | Microsoft.AgFoodPlatform/farmers/farmers/managementZones/delete | Deletes an existing AgFoodPlatform management zones resource. |
> | Microsoft.AgFoodPlatform/farmers/farmers/managementZones/list/action | List(s) existing AgFoodPlatform management zone resource(s). |
> | Microsoft.AgFoodPlatform/farmers/managementZones/list/action | List(s) existing AgFoodPlatform management zone resource(s). |
> | Microsoft.AgFoodPlatform/farmers/parties/managementZones/read | Gets or Lists existing AgFoodPlatform management zones resource(s). |
> | Microsoft.AgFoodPlatform/farmers/parties/managementZones/write | Creates or Updates AgFoodPlatform management zones. |
> | Microsoft.AgFoodPlatform/farmers/parties/managementZones/delete | Deletes an existing AgFoodPlatform management zones resource. |
> | Microsoft.AgFoodPlatform/farmers/parties/managementZones/list/action | List(s) existing AgFoodPlatform management zone resource(s). |

## Microsoft.BotService

Intelligent, serverless bot service that scales on demand.

Azure service: [Azure Bot Service](/azure/bot-service/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.BotService/register/action | Subscription Registration Action |
> | Microsoft.BotService/listqnamakerendpointkeys/action | List QnAMaker Keys |
> | Microsoft.BotService/checknameavailability/action | Check Name Availability of a Bot |
> | Microsoft.BotService/listauthserviceproviders/action | List Auth Service Providers |
> | Microsoft.BotService/botServices/read | Read a Bot Service |
> | Microsoft.BotService/botServices/write | Write a Bot Service |
> | Microsoft.BotService/botServices/delete | Delete a Bot Service |
> | Microsoft.BotService/botServices/createemailsigninurl/action | Create a sign in url for email channel modern auth |
> | Microsoft.BotService/botServices/privateEndpointConnectionsApproval/action | Approval for creating a Private Endpoint |
> | Microsoft.BotService/botServices/joinPerimeter/action | Description for action of Join Perimeter |
> | Microsoft.BotService/botServices/channels/read | Read a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/write | Write a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/delete | Delete a Bot Service Channel |
> | Microsoft.BotService/botServices/channels/listchannelwithkeys/action | List Botservice channels with secrets |
> | Microsoft.BotService/botServices/channels/regeneratekeys/action | Action to Regenerate Channel Keys |
> | Microsoft.BotService/botServices/channels/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/channels/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/channels/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/botServices/channels/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/connections/read | Read a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/write | Write a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/delete | Delete a Bot Service Connection |
> | Microsoft.BotService/botServices/connections/listwithsecrets/action | List Connection with Secrets |
> | Microsoft.BotService/botServices/connections/listwithsecrets/write | Write a Bot Service Connection List  |
> | Microsoft.BotService/botServices/connections/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/connections/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/connections/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/botServices/connections/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/networkSecurityPerimeterAssociationProxies/read | Read a Network Security Perimeter Association Proxies resource |
> | Microsoft.BotService/botServices/networkSecurityPerimeterAssociationProxies/write | Write a Network Security Perimeter Association Proxies resource |
> | Microsoft.BotService/botServices/networkSecurityPerimeterAssociationProxies/delete | Delete a Network Security Perimeter Association Proxies resource |
> | Microsoft.BotService/botServices/networkSecurityPerimeterConfigurations/read | Read a Network Security Perimeter Configurations resource |
> | Microsoft.BotService/botServices/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile a Network Security Perimeter Configurations resource |
> | Microsoft.BotService/botServices/privateEndpointConnectionProxies/read | Read a connection proxy resource |
> | Microsoft.BotService/botServices/privateEndpointConnectionProxies/write | Write a connection proxy resource |
> | Microsoft.BotService/botServices/privateEndpointConnectionProxies/delete | Delete a connection proxy resource |
> | Microsoft.BotService/botServices/privateEndpointConnectionProxies/validate/action | Validate a connection proxy resource |
> | Microsoft.BotService/botServices/privateEndpointConnections/read | Read a Private Endpoint Connections Resource |
> | Microsoft.BotService/botServices/privateEndpointConnections/write | Write a Private Endpoint Connections Resource |
> | Microsoft.BotService/botServices/privateEndpointConnections/delete | Delete a Private Endpoint Connections Resource |
> | Microsoft.BotService/botServices/privateLinkResources/read | Read a Private Links Resource |
> | Microsoft.BotService/botServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/botServices/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/botServices/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/checknameavailability/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/checknameavailability/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/checknameavailability/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/checknameavailability/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/hostsettings/read | Get the settings needed to host bot service |
> | Microsoft.BotService/hostsettings/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/hostsettings/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/hostsettings/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/hostsettings/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/listauthserviceproviders/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/listauthserviceproviders/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/listauthserviceproviders/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/listauthserviceproviders/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/listqnamakerendpointkeys/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.BotService/listqnamakerendpointkeys/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/listqnamakerendpointkeys/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for &lt;Name of the resource&gt; |
> | Microsoft.BotService/listqnamakerendpointkeys/providers/Microsoft.Insights/metricDefinitions/read | Creates or updates the diagnostic setting for the resource |
> | Microsoft.BotService/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Notify Network Security Perimeter Updates Available |
> | Microsoft.BotService/locations/operationresults/read | Read the status of an asynchronous operation |
> | Microsoft.BotService/operationresults/read | Read the status of an asynchronous operation |
> | Microsoft.BotService/Operations/read | Read the operations for all resource types |

## Microsoft.CognitiveServices

Add smart API capabilities to enable contextual interactions.

Azure service: [Cognitive Services](/azure/cognitive-services/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CognitiveServices/register/action | Subscription Registration Action |
> | Microsoft.CognitiveServices/register/action | Registers Subscription for Cognitive Services |
> | Microsoft.CognitiveServices/checkDomainAvailability/action | Reads available SKUs for a subscription. |
> | Microsoft.CognitiveServices/accounts/read | Reads API accounts. |
> | Microsoft.CognitiveServices/accounts/write | Writes API Accounts. |
> | Microsoft.CognitiveServices/accounts/delete | Deletes API accounts |
> | Microsoft.CognitiveServices/accounts/joinPerimeter/action | Allow to join CognitiveServices account to an given perimeter. |
> | Microsoft.CognitiveServices/accounts/listKeys/action | List keys |
> | Microsoft.CognitiveServices/accounts/regenerateKey/action | Regenerate Key |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionsApproval/action | Approves Private Endpoint |
> | Microsoft.CognitiveServices/accounts/commitmentplans/read | Reads commitment plans. |
> | Microsoft.CognitiveServices/accounts/commitmentplans/write | Writes commitment plans. |
> | Microsoft.CognitiveServices/accounts/commitmentplans/delete | Deletes commitment plans. |
> | Microsoft.CognitiveServices/accounts/defenderForAISettings/read | Gets all applicable policies under the account including default policies. |
> | Microsoft.CognitiveServices/accounts/defenderForAISettings/write | Create or update a custom Responsible AI policy. |
> | Microsoft.CognitiveServices/accounts/defenderForAISettings/delete | Deletes a custom Responsible AI policy that's not referenced by an existing deployment. |
> | Microsoft.CognitiveServices/accounts/deployments/read | Reads deployments. |
> | Microsoft.CognitiveServices/accounts/deployments/write | Writes deployments. |
> | Microsoft.CognitiveServices/accounts/deployments/delete | Deletes deployments. |
> | Microsoft.CognitiveServices/accounts/encryptionScopes/read | Reads an Encryption Scope. |
> | Microsoft.CognitiveServices/accounts/encryptionScopes/write | Writes an Encryption Scope. |
> | Microsoft.CognitiveServices/accounts/encryptionScopes/delete | Deletes an Encryption Scope. |
> | Microsoft.CognitiveServices/accounts/models/read | Reads available models. |
> | Microsoft.CognitiveServices/accounts/networkSecurityPerimeterAssociationProxies/read | Reads a network security perimeter association. |
> | Microsoft.CognitiveServices/accounts/networkSecurityPerimeterAssociationProxies/write | Writes a network security perimeter association. |
> | Microsoft.CognitiveServices/accounts/networkSecurityPerimeterAssociationProxies/delete | Deletes a network security perimeter association. |
> | Microsoft.CognitiveServices/accounts/networkSecurityPerimeterConfigurations/read | Read effective Network Security Perimeters configuration |
> | Microsoft.CognitiveServices/accounts/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile effective Network Security Perimeters configuration |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/read | Reads private endpoint connection proxies (internal use only). |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/write | Writes private endpoint connection proxies (internal use only). |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/delete | Deletes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnectionProxies/validate/action | Validates private endpoint connection proxies (internal use only). |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/read | Reads private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/write | Writes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateEndpointConnections/delete | Deletes a private endpoint connections. |
> | Microsoft.CognitiveServices/accounts/privateLinkResources/read | Reads private link resources for an account. |
> | Microsoft.CognitiveServices/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.CognitiveServices/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.CognitiveServices/accounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Cognitive Services account |
> | Microsoft.CognitiveServices/accounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Cognitive Services. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/read | Reads available blocklists under a resource. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/write | Modifies available blocklists under a resource. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/delete | Deletes blocklists under a resource |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/addRaiBlocklistItems/action | Batch adds blocklist items under a blocklist. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/deleteRaiBlocklistItems/action | Batch deletes blocklist items under a blocklist. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/raiBlocklistItems/read | Gets blocklist items under a blocklist. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/raiBlocklistItems/write | Modifies blocklist items under a blocklist. |
> | Microsoft.CognitiveServices/accounts/raiBlocklists/raiBlocklistItems/delete | Deletes blocklist items under a blocklist. |
> | Microsoft.CognitiveServices/accounts/raiPolicies/read | Gets all applicable policies under the account including default policies. |
> | Microsoft.CognitiveServices/accounts/raiPolicies/write | Create or update a custom Responsible AI policy. |
> | Microsoft.CognitiveServices/accounts/raiPolicies/delete | Deletes a custom Responsible AI policy that's not referenced by an existing deployment. |
> | Microsoft.CognitiveServices/accounts/skus/read | Reads available SKUs for an existing resource. |
> | Microsoft.CognitiveServices/accounts/usages/read | Get the quota usage for an existing resource. |
> | Microsoft.CognitiveServices/attestationdefinitions/read | Reads all subscription level attestation definitions |
> | Microsoft.CognitiveServices/attestations/read | Reads Attestations |
> | Microsoft.CognitiveServices/attestations/write | Writes Attestation |
> | Microsoft.CognitiveServices/calculateModelCapacity/read | Reads available capacities of a model. |
> | Microsoft.CognitiveServices/capacityReservations/read | Reads API accounts. |
> | Microsoft.CognitiveServices/capacityReservations/write | Writes API Accounts. |
> | Microsoft.CognitiveServices/capacityReservations/delete | Deletes API accounts |
> | Microsoft.CognitiveServices/deletedAccounts/read | List deleted accounts. |
> | Microsoft.CognitiveServices/locations/checkSkuAvailability/action | Reads available SKUs for a subscription. |
> | Microsoft.CognitiveServices/locations/deleteVirtualNetworkOrSubnets/action | Notification from Microsoft.Network of deleting VirtualNetworks or Subnets. |
> | Microsoft.CognitiveServices/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Notification from Microsoft.Network of NetworkSecurityPerimeter updates. |
> | Microsoft.CognitiveServices/locations/commitmentTiers/read | Reads available commitment tiers. |
> | Microsoft.CognitiveServices/locations/modelCapacities/read | Reads available capacities of a model. |
> | Microsoft.CognitiveServices/locations/models/read | Reads available models. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/read | Reads a network security perimeter. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/write | Writes a network security perimeter. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/delete | Deletes  a network security perimeter. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/read | Reads a network security perimeter profile. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/write | Writes a network security perimeter profile. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/delete | Deletes a network security perimeter profile. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/read | Reads a network security perimeter rule. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/write | Writes a network security perimeter rule. |
> | Microsoft.CognitiveServices/locations/networkSecurityPerimeterProxies/profileProxies/delete | Deletes a network security perimeter rule. |
> | Microsoft.CognitiveServices/locations/operationresults/read | Read the status of an asynchronous operation. |
> | Microsoft.CognitiveServices/locations/raiContentFilters/read | List all available content filters |
> | Microsoft.CognitiveServices/locations/resourceGroups/deletedAccounts/read | Get deleted account. |
> | Microsoft.CognitiveServices/locations/resourceGroups/deletedAccounts/delete | Purge deleted account. |
> | Microsoft.CognitiveServices/locations/usages/read | Read all usages data |
> | Microsoft.CognitiveServices/modelCapacities/read | Reads available capacities of a model. |
> | Microsoft.CognitiveServices/models/read | Reads available models. |
> | Microsoft.CognitiveServices/Operations/read | List all available operations |
> | Microsoft.CognitiveServices/skus/read | Reads available SKUs for Cognitive Services. |
> | **DataAction** | **Description** |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models:detect-last/action | Submit multivariate anomaly detection task with the modelId of trained model and inference data, and the inference data should be put into request body in a JSON format. The request will complete synchronously and return the detection immediately in the response body. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models:detect-batch/action | Submit multivariate anomaly detection task with the modelId of trained model and inference data, the input schema should be the same with the training request. The request will complete asynchronously and return a resultId to query the detection result.The request should be a source link to indicate an externally accessible Azure storage Uri, either pointed to an Azure blob storage folder, or pointed to a CSV file in Azure blob storage. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/action | Create and train a multivariate anomaly detection model.<br>The request must include a source parameter to indicate an externally accessible Azure blob storage URI.There are two types of data input: An URI pointed to an Azure blob storage folder which contains multiple CSV files, and each CSV file contains two columns, timestamp and variable.<br>Another type of input is an URI pointed to a CSV file in Azure blob storage, which contains all the variables and a timestamp column. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/detect-batch/read | For asynchronous inference, get multivariate anomaly detection result based on resultId returned by the BatchDetectAnomaly api. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/write | Create and train a multivariate anomaly detection model.<br>The request must include a source parameter to indicate an externally accessible Azure storage Uri (preferably a Shared Access Signature Uri).<br>All time-series used in generate the model must be zipped into one single file.<br>Each time-series will be in a single CSV file in which the first column is timestamp and the second column is value. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/delete | Delete an existing multivariate model according to the modelId |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/detect/action | Submit detection multivariate anomaly task with the trained model of modelId, the input schema should be the same with the training request.<br>Thus request will be complete asynchronously and will return a resultId for querying the detection result.The request should be a source link to indicate an externally accessible Azure storage Uri (preferably a Shared Access Signature Uri).<br>All time-series used in generate the model must be zipped into one single file.<br>Each time-series will be as follows: the first column is timestamp and the second column is value.<br>Synchronized API for anomaly detection. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/read | Get detailed information of multivariate model, including the training status and variables used in the model. List models of a subscription |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/models/export/action | Export multivariate anomaly detection model based on modelId |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/multivariate/results/read | Get multivariate anomaly detection result based on resultId returned by the DetectAnomalyAsync api |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/changepoint/detect/action | This operation generates a model using an entire series, each point is detected with the same model.<br>With this method, points before and after a certain point are used to determine whether it is a trend change point.<br>The entire detection can detect all trend change points of the time series. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/entire/detect/action | This operation generates a model using an entire series, each point is detected with the same model.<br>With this method, points before and after a certain point are used to determine whether it is an anomaly.<br>The entire detection can give the user an overall status of the time series. |
> | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/last/detect/action | This operation generates a model using points before the latest one. With this method, only historical points are used to determine whether the target point is an anomaly. The latest point detecting matches the scenario of real-time monitoring of business metrics. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/AudioFiles/delete | Delete audio files. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/AudioFiles/read | Query ACC exported audio files. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/CustomLexicons/write | Edit custom lexicon lexemes. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/CustomLexicons/read | Query custom lexicon lexemes. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/delete | Delete voice general tasks. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/read | Query metadata of voice general tasks for specific module kind. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/ApplyTuneTemplateTasks/read | Query ACC apply tune template tasks. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/AudioGenerationTasks/SubmitAudioGenerationTask/action | Create audio audio task. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/AudioGenerationTasks/read | Query ACC export audio tasks. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/CharacterPredictionTasks/SubmitPredictSsmlTagsTask/action | Create predict ssml tag task. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/CharacterPredictionTasks/read | Query ACC predict ssml content type tasks. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ExportTasks/ImportResourceFilesTasks/read | Import resource files tasks. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/IsCurrentSubscriptionInGroup/action | Check whether current subscription is in specific group kind. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/BlobEntitiesEndpointWithSas/read | Query blob url with SAS of artifacts. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/CustomvoiceGlobalSettings/read | Query customvoice global settings. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/LanguageMetadatas/read | Query language metadata. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/Reports/read | Generic query report API for endpoint billing history, model training hours history etc. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/TuneMetadatas/read | Query tuning metadata. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/Versions/read | Query API version. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Metadata/Voices/read | Query ACC voices. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Phoneme/validate/action | Validate phoneme. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Phoneme/PronLearnFromAudio/action | PronLearnFromAudio. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ResourceFolders/write | Edit folder metadata like name, tags. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ResourceFolders/ResourceFiles/CopyOrMoveResourceFolderOrFiles/action | Copy or move folder or files. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ResourceFolders/ResourceFiles/delete | Delete folder or files recursively, with optional to delete associated audio files. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ResourceFolders/ResourceFiles/write | Edit file's metadata like name, description, tags etc. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/ResourceFolders/ResourceFiles/read | Query files metadata like recursive file count, associated audio file count, exporting audio ssml file count. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Synthesis/SpeakMetadata/action | Query TTS synthesis metadata like F0, duration(used for intonation tuning). |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Synthesis/SpeakMetadataForPronunciation/action | Query TTS synthesis metadata for pronunciation. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Synthesis/Speak/action | TTS synthesis API for all ACC voices. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/Synthesis/PredictSsmlTagsRealtime/action | Realtime API for predict ssml tag. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/ConfigureSsmlFileReferenceFiles/action | Add/update/delete item(s) of SSML reference file plugin. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/ApplySequenceTuneOnFiles/action | Apply several ssml tag tune on one ssml file sequentially. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/SequenceTune/action | Apply several ssml tag tune on one ssml sequentially. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/MultiSequenceTune/action | Process several ssml tag sequence tune into one request. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/MultiTune/action | Process several ssml tag tune into one request. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/SplitSsmls/action | Split ssml with specified options. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneSsml/Tune/action | Tune ssml tag on ssml. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneTemplates/DetectTuneTemplate/action | Detect tune template. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneTemplates/read | Query tune template. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneTemplates/write | Create tune template. |
> | Microsoft.CognitiveServices/accounts/AudioContentCreation/TuneTemplates/delete | Delete tune template. |
> | Microsoft.CognitiveServices/accounts/Autosuggest/search/action | This operation provides suggestions for a given query or partial query. |
> | Microsoft.CognitiveServices/accounts/BatchAvatar/batchsyntheses/read | Gets one or more avatar batch syntheses. |
> | Microsoft.CognitiveServices/accounts/BatchAvatar/batchsyntheses/write | Submits a new avatar batch synthesis. |
> | Microsoft.CognitiveServices/accounts/BatchAvatar/batchsyntheses/delete | Deletes the batch synthesis identified by the given ID. |
> | Microsoft.CognitiveServices/accounts/BatchAvatar/operations/read | Gets detail of operations |
> | Microsoft.CognitiveServices/accounts/BatchTextToSpeech/batchsyntheses/read | Gets one or more text to speech batch syntheses. |
> | Microsoft.CognitiveServices/accounts/BatchTextToSpeech/batchsyntheses/write | Submits a new text to speech batch synthesis. |
> | Microsoft.CognitiveServices/accounts/BatchTextToSpeech/batchsyntheses/delete | Deletes the batch synthesis identified by the given ID. |
> | Microsoft.CognitiveServices/accounts/BatchTextToSpeech/operations/read | Gets detail of operations |
> | Microsoft.CognitiveServices/accounts/Billing/submitusage/action | submit usage with meter name and quantity specified in request body. |
> | Microsoft.CognitiveServices/accounts/Billing/createlicense/action | create and return a license for a subscription and list of license keys specified in request body. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/analyze/action | This operation extracts a rich set of visual features based on the image content.  |
> | Microsoft.CognitiveServices/accounts/ComputerVision/describe/action | This operation generates a description of an image in human readable language with complete sentences.<br> The description is based on a collection of content tags, which are also returned by the operation.<br>More than one description can be generated for each image.<br> Descriptions are ordered by their confidence score.<br>All descriptions are in English. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/generatethumbnail/action | This operation generates a thumbnail image with the user-specified width and height.<br> By default, the service analyzes the image, identifies the region of interest (ROI), and generates smart cropping coordinates based on the ROI.<br> Smart cropping helps when you specify an aspect ratio that differs from that of the input image |
> | Microsoft.CognitiveServices/accounts/ComputerVision/ocr/action | Optical Character Recognition (OCR) detects text in an image and extracts the recognized characters into a machine-usable character stream.    |
> | Microsoft.CognitiveServices/accounts/ComputerVision/recognizetext/action | Use this interface to get the result of a Recognize Text operation. When you use the Recognize Text interface, the response contains a field called "Operation-Location". The "Operation-Location" field contains the URL that you must use for your Get Recognize Text Operation Result operation. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/tag/action | This operation generates a list of words, or tags, that are relevant to the content of the supplied image.<br>The Computer Vision API can return tags based on objects, living beings, scenery or actions found in images.<br>Unlike categories, tags are not organized according to a hierarchical classification system, but correspond to image content.<br>Tags may contain hints to avoid ambiguity or provide context, for example the tag "cello" may be accompanied by the hint "musical instrument".<br>All tags are in English. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/areaofinterest/action | This operation returns a bounding box around the most important area of the image. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/detect/action | This operation Performs object detection on the specified image.  |
> | Microsoft.CognitiveServices/accounts/ComputerVision/imageanalysis:analyze/action | Analyze the input image. The request either contains image stream with any content type ['image/*', 'application/octet-stream'], or a JSON payload which includes an url property to be used to retrieve the image stream. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/imageanalysis:segment/action | Analyze the input image.<br>The request either contains an image stream with any content type ['image/*', 'application/octet-stream'], or a JSON payload which includes a url property to be used to retrieve the image stream.<br>An image stream of content type 'image/png' is returned, where the pixel values depend on the analysis mode.<br>The returned image has the same dimensions as the input image for modes: foregroundMatting.<br>The returned image has the same aspect ratio and same dimensions as the input image up to a limit of 16 megapixels for modes: backgroundRemoval. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/imagecomposition:rectify/action | Run the image rectification operation against an image with 4 control points provided in the parameter. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/imagecomposition:stitch/action | Run the image stitching operation against a sequence of images. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models:cancel/action | Cancel model training. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/planogramcompliance:match/action | Run the planogram matching operation against a planogram and a product understanding result. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval:vectorizeimage/action | Return vector from an image. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval:vectorizetext/action | Return vector from a text. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/grounding/action | Perform grounding on the input image with the generated text. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/write | This internal operation creates a new batch with the specified name. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/read | This internal operation returns the list of batches. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/analyzestatus/read | This internal operation returns the status of the specified batch. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/imageretrieval/write | This internal operation ingests image vector and metadata to retrieval service. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/searchmetadata/write | This internal operation ingests image metadata to retrieval service. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/segmentation/write | This internal operation creates a new video segmentation batch with the specified name. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/batch/status/read | This internal operation returns the status of the specified batch. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/datasets/read | Get information about a specific dataset. Get a list of datasets that have been registered. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/datasets/write | Register a new dataset. Update the properties of an existing dataset. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/datasets/delete | Unregister a dataset. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/deployments/write | Deploy an operation to be run on the target device. Update the properties of an existing deployment. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/deployments/delete | Delete a deployment, removing the operation from the target device. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/deployments/read | Get information about a specific deployment. Get a list of deployments that have been created. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/images/delete | Face User Correction - Delete Batch Images |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/delete | Face User Correction - Delete User |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/groups/merge/action | Face User Correction - Merge Groups |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/groups/faces/write | Face User Correction - Add Faces to Group |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/groups/faces/delete | Face User Correction - Remove Faces from Group |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/images/delete | Face User Correction - Delete Images |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/correction/users/operations/read | Face User Correction - Get Operation State |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/users/uncertainfaces/action | Face Grouping - Get Uncertain Faces |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/users/resetgroups/action | Face Grouping - Reset Groups |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/users/groupondemand/action | Face Grouping - Group on Demand |
> | Microsoft.CognitiveServices/accounts/ComputerVision/face/users/retrievegroups/action | Face Grouping - Retrieve Groups |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/read | This operation returns the list of domain-specific models that are supported by the Computer Vision API.  Currently, the API supports following domain-specific models: celebrity recognizer, landmark recognizer. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/analyze/action | This operation recognizes content within an image by applying a domain-specific model.<br> The list of domain-specific models that are supported by the Computer Vision API can be retrieved using the /models GET request.<br> Currently, the API provides following domain-specific models: celebrities, landmarks. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/:cancel/action | Cancel model training. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/delete | Delete a custom model. A model can be deleted if it is in one of the 'Succeeded', 'Failed', or 'Canceled' states. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/write | Start training a custom model. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/evaluations/write | Evaluate an existing model. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/evaluations/delete | Delete a model evaluation. A model evaluation can be deleted if it is in the 'Succeeded' or 'Failed' states. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/models/evaluations/read | Get information about a specific model evaluation. Get a list of the available evaluations for a model.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/operations/imageanalysis:analyze/action | Analyze the input image of incoming request without deployment. The request either contains image stream |
> | Microsoft.CognitiveServices/accounts/ComputerVision/operations/read | Get information about a specific operation. Get a list of the available operations. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/operations/contentgeneration-backgrounds:generate/action | Generates a background from a specified query, style, and size. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/productrecognition/runs/write | Run the product recognition against a model with an image. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/productrecognition/runs/delete | Delete a product recognition run. A product recognition run can be deleted if it is in the 'Succeeded' or 'Failed' states. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/productrecognition/runs/read | Get information about a specific product recognition run. List all product recognition run of a model.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyze/action | Use this interface to perform a Read operation, employing the state-of-the-art Optical Character Recognition (OCR) algorithms optimized for text-heavy documents.<br>It can handle hand-written, printed or mixed documents.<br>When you use the Read interface, the response contains a header called 'Operation-Location'.<br>The 'Operation-Location' header contains the URL that you must use for your Get Read Result operation to access OCR results.** |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyzeresults/read | Use this interface to retrieve the status and OCR result of a Read operation.  The URL containing the 'operationId' is returned in the Read operation 'Operation-Location' response header.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/core/asyncbatchanalyze/action | Use this interface to get the result of a Batch Read File operation, employing the state-of-the-art Optical Character |
> | Microsoft.CognitiveServices/accounts/ComputerVision/read/operations/read | This interface is used for getting OCR results of Read operation. The URL to this interface should be retrieved from <b>"Operation-Location"</b> field returned from Batch Read File interface. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/index-statis/action | Get index statistics inforamtion for the given users. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/suggest/action | Get search suggestions for the user, given the query text that the user has entered so far. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/search/action | Perform a search using the specified search query and parameters. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes:query/action | Search indexes using the specified search query and parameters. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes:querybyimage/action | Performs a image-based search on the specified index. The request accepts either image Url or base64 encoded image string. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes:querybytext/action | Performs a text-based search on the specified index. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes:sample/action | Performs a sampling technique on the doucment within an index. The request contains index name and document id . |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/documents/read | Get a list of all documents. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/facegroups/read | Get the list of available face groups for a user. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/facegroups/write | Update the properties of a face group. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/delete | Deletes an index and all its associated ingestion documents. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/write | This method creates an index, which can then be used to ingest documents. Updates an index with the specified name.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/read | Retrieves the index with the specified name. Retrieves a list of all indexes across all ingestions.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/documents/write | Create a document in an index. If the index doesn't exist, then it will be created automatically. Update a document.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/documents/delete | Delete a document. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/documents/read | Get a list of documents within an index. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/ingestions/write | Ingestion request can have either video or image payload at once, but not both. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/indexes/ingestions/read | Gets the ingestion status for the specified index and ingestion name. Retrieves all ingestions for the specific index.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/retrieval/publickey/read | Gets a public key from certificate service in order to encrypt data. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/store/delete | Perform a delete user operation for ODC. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/textoperations/read | This interface is used for getting recognize text operation result. The URL to this interface should be retrieved from <b>"Operation-Location"</b> field returned from Recognize Text interface. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/indexes/write | This method creates a video index manager task, which can then be used to manipulate AI Search Indexes. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/indexes/delete | Deletes a video index manager task independent of the task status. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/indexes/read | Retrieves the video index manager task with the specified task id. Retrieves a list of all video index manager tasks.* |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/videodescriptions/write | This method creates an video description task, which can then be used to generate video insights. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/videodescriptions/delete | Deletes a video description task independent of the task status. |
> | Microsoft.CognitiveServices/accounts/ComputerVision/videoanalysis/videodescriptions/read | Retrieves the video description task with the specified task id. Retrieves a list of all video description tasks.* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/action | Create image list. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/action | Create term list. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/image:analyze/action | A sync API for harmful content analysis for image |
> | Microsoft.CognitiveServices/accounts/ContentModerator/image:batchanalyze/action | An API to trigger harmful content analysis for image batch |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text:analyze/action | A sync API for harmful content analysis for text |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text:batchanalyze/action | An API for triggering harmful content analysis of text batch |
> | Microsoft.CognitiveServices/accounts/ContentModerator/image/analyzeresults/read | An API to get harmful content analysis results for image batch |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/read | Image Lists -  Get Details - Image Lists - Get All |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/delete | Image Lists - Delete |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/refreshindex/action | Image Lists - Refresh Search Index |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/write | Image Lists - Update Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/write | Add an Image to your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/delete | Delete an Image from your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. Delete all images from your list. The image list can be used to do fuzzy matching against other images when using Image/Match API.* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/read | Image - Get all Image Ids |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/evaluate/action | Returns probabilities of the image containing racy or adult content. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/findfaces/action | Find faces in images. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/match/action | Fuzzily match an image against one of your custom Image Lists. You can create and manage your custom image lists using this API.  |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/ocr/action | Returns any text found in the image for the language specified. If no language is specified in input then the detection defaults to English. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/detectlanguage/action | This operation will detect the language of given input content. Returns the ISO 639-3 code for the predominant language comprising the submitted text. Over 110 languages supported. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/screen/action | The operation detects profanity in more than 100 languages and match against custom and shared blocklists. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/action | A job Id will be returned for the Image content posted on this endpoint.  |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/action | The reviews created would show up for Reviewers on your team. As Reviewers complete reviewing, results of the Review would be POSTED (i.e. HTTP POST) on the specified CallBackEndpoint. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/read | Get the Job Details for a Job Id. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/read | Returns review details for the review Id passed. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/publish/action | Video reviews are initially created in an unpublished state - which means it is not available for reviewers on your team to review yet. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcript/action | This API adds a transcript file (text version of all the words spoken in a video) to a video review. The file should be a valid WebVTT format. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcriptmoderationresult/action | This API adds a transcript screen text result file for a video review. Transcript screen text result file is a result of Screen Text API . In order to generate transcript screen text result file , a transcript file has to be screened for profanity using Screen Text API. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/accesskey/read | Get the review content access key for your team. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/write | Use this method to add frames for a video review. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/write | Creates or updates the specified template |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/delete | Delete a template in your team |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/read | Returns an array of review templates provisioned on this team. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/write | Create a new workflow or update an existing one. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/read | Get the details of a specific Workflow on your Team Get all the Workflows available for you Team* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/bulkupdate/action | Term Lists - Bulk Update |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/delete | Term Lists - Delete |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/read | Term Lists - Get All - Term Lists - Get Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/refreshindex/action | Term Lists - Refresh Search Index |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/write | Term Lists - Update Details |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/write | Term - Add Term |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/delete | Term - Delete - Term - Delete All Terms |
> | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/read | Term - Get All Terms |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/detect/action | A sync API for harmful content detection |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/analyzeresults/read | An API to get harmful content analysis results for text batch |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/write | Updates an Text List by listId, , if listId not exists, create a new Text List |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/delete | Deletes Text List with the list Id equal to list Id passed. |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/read | Get All Text Lists Returns text list details of the Text List with list Id equal to list Id passed.* |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/items/write | Create Item In Text List |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/items/delete | Delete Item By itemId and listId |
> | Microsoft.CognitiveServices/accounts/ContentModerator/text/lists/items/read | Get All Items By listId Get Item By itemId and listId* |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image:analyze/action | A sync API for harmful content analysis for image. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:analyze/action | A sync API for harmful content analysis for text. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/imagewithtext:analyze/action | A sync API for harmful content analysis for image with text |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectprotectedmaterial/action | A synchronous API for the analysis of protected material. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectjailbreak/action | A synchronous API for the analysis of text jailbreak. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:adaptiveannotate/action | A remote procedure call (RPC) operation. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectungroundedness/action | A synchronous API for the analysis of language model outputs to determine if they align with the information provided by the user or contain fictional content. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:shieldprompt/action | A synchronous API for the analysis of text prompt injection attacks. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectgroundedness/action | A synchronous API for the analysis of language model outputs to determine alignment with user-provided information or identify fictional content. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/analyze/action | A synchronous API for the unified analysis of input content |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image:detectincidents/action | A synchronous API for the analysis of image detect incidents. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectincidents/action | A synchronous API for the analysis of text detect incidents. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:analyzecustomcategory/action | A synchronous API for the analysis of text on custom category. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:autoreview/action | A synchronous API for the automatic review of harmful content |
> | Microsoft.CognitiveServices/accounts/ContentSafety/analyzebysafetypolicy/action | A synchronous API for the safety policy analysis of input content |
> | Microsoft.CognitiveServices/accounts/ContentSafety/analyzeWithRaiPolicy/action | A synchronous API for the rai policy analysis of input content |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text:detectprotectedmaterialforcode/action | Detect protected material for code |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image:detectwatermark/action | A synchronous API for decoding the content credentials from assets. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image/incidents/read | Get or List Image Incidents |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image/incidents/write | Updates a image incident. If the image incident does not exist, a new image incident will be created. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image/incidents/delete | Deletes a image incident. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/image/incidents/incidentsamples/read | Get incidentSamples By incidentName from a image incident. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/blocklistHitCalls/read | Show blocklist hit request count at different timestamps. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/blocklistTopTerms/read | List top terms hit in blocklist at different timestamps. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/categories/requestCounts/read | List API request count at different timestamps of a specific category given a time range. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/rejectCounts/read | List API reject counts at different timestamps given a time range. Default maxpagesize is 1000. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/requestCounts/read | List API request counts at different timestamps given a time range. Default maxpagesize is 1000. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/metrics/requestLatencies/read | List API request latencies at different timestamps given a time range. Default maxpagesize is 1000. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/raipolicies/write | Create or update Rai policy |
> | Microsoft.CognitiveServices/accounts/ContentSafety/raipolicies/delete | Delete a rai policy by raiPolicyName |
> | Microsoft.CognitiveServices/accounts/ContentSafety/raipolicies/read | Get or List Rai Policy |
> | Microsoft.CognitiveServices/accounts/ContentSafety/safetypolicies/write | Create or update safety policy |
> | Microsoft.CognitiveServices/accounts/ContentSafety/safetypolicies/delete | Delete a safety policy by policyName |
> | Microsoft.CognitiveServices/accounts/ContentSafety/safetypolicies/read | Get or List Safety Policy |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/autoreviewers/delete | Delete an auto reviewer or a specific version of it. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/autoreviewers/read | Get a auto reviewer or a specific version of it. List latest versions of auto reviewers.* |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/autoreviewers/write | Create new auto reviewer or a new version of existing auto reviewer. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/autoreviewers/operations/read | Get an auto reviewer operation. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/blocklists/read | Get or List Text Blocklist |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/blocklists/write | Updates a text blocklist, if blocklistName does not exist, create a new blocklist. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/blocklists/delete | Deletes a text blocklist. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/blocklists/blockitems/read | Get blockItem By blockItemId from a text blocklist. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/categories/read | Get or List Text Categories |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/categories/write | Create or replace operation template. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/categories/delete | Resource delete operation template. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/categories/operations/read | Get an custom category operation. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/incidents/read | Get or List Text Incidents |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/incidents/write | Updates a text incident. If the text incident does not exist, a new text incident will be created. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/incidents/delete | Deletes a text incident. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/text/incidents/incidentsamples/read | Get incidentSamples By incidentName from a text incident. |
> | Microsoft.CognitiveServices/accounts/ContentSafety/whitelist/features/read | Get allowlist features. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/write | Creates a new project or replaces metadata of an existing project. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/delete | Deletes a project. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/export/action | Triggers a job to export project data in JSON format. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/read | Returns a project. Returns the list of existing projects.* |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/import/action | Triggers a job to import a new project in JSON format. If a project with the same name already exists, the data of that project is replaced. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/train/action | Trigger training job. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/deployments/write | Trigger job to create new deployment or replace an existing deployment. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/deployments/jobs/read | Gets a deployment job status and result details. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/evaluation/read | Get the evaluation result of a certain training model name. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/export/jobs/read | Get export job status details. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/export/jobs/result/read | Get export job result details. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/import/jobs/read | Get import or replace project job status and result details. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/languages/read | Get List of Supported Cultures for conversational projects. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/models/delete | Deletes a trained model. |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/models/read | Gets a specific trained model of a project. Gets the trained models of a project.* |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/train/jobs/read | Get training jobs result details for a project. Get training job status and result details.* |
> | Microsoft.CognitiveServices/accounts/ConversationalLanguageUnderstanding/projects/validation/read | Get the validation result of a certain training model name. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/data/action | Validate custom avatar training data. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/models/action | Deploys models. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/consents/read | Read avatar talent consents. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/consents/delete | Delete avatar talent consents. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/consents/write | Create avatar talent consents. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/data/read | Read custom avatar training data. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/data/delete | Delete custom avatar training data. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/data/write | Create custom avatar training data. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/endpoints/read | Gets one or more custom avatar endpoints. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/endpoints/delete | Deletes endpoints. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/features/read | Read allowed features of custom avatar. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/models/read | Gets one or more custom avatar models. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/models/delete | Deletes models. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/models/write | Creates custom avatar models. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/operations/read | Gets detail of operations |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/projects/read | Gets one or more custom avatar projects. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/projects/write | Creates custom avatar projects. |
> | Microsoft.CognitiveServices/accounts/CustomAvatar/projects/delete | Deletes custom avatar projects. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/action | Create a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/user/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/quota/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/action | Create a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/action | Classify an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/action | Classify an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/nostore/action | Classify an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/nostore/action | Classify an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/action | Detect objects in an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/action | Detect objects in an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/nostore/action | Detect objects in an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/nostore/action | Detect objects in an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/domains/read | Get information about a specific domain. Get a list of the available domains.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/action | Set pool size of Label Proposal. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/read | Get pool size of Label Proposal for this project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/project/migrate/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/action | This API accepts body content as multipart/form-data and application/octet-stream. When using multipart |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/action | Create a tag for the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/delete | Delete a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/read | Get a specific project. Get your projects.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/train/action | Queues project for training. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/write | Update a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/import/action | Imports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/export/read | Exports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/action | This API accepts a batch of image regions, and optionally tags, to update existing images with region information. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/files/action | This API accepts a batch of files, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/predictions/action | This API creates a batch of images from predicted images specified. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/urls/action | This API accepts a batch of urls, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/action | Associate a set of images with a set of tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/delete | Delete images from the set of training images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regionproposals/action | This API will get region proposals for an image along with confidences for the region. It returns an empty array if no proposals are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/action | This API will fetch untagged images filtered by suggested tags Ids. It returns an empty array if no images are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/id/read | This API will return a set of Images for the specified tags and optionally iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/delete | Delete a set of image regions. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/count/action | This API takes in tagIds to get count of untagged images per suggested tags for a given threshold. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/delete | Remove a set of tags from a set of images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/count/read | This API returns the images which have no tags for a given project and optionally an iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/delete | Delete a specific iteration of a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/action | Export a trained iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/read | Get a specific iteration. Get iterations for the project.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/action | Publish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/write | Update a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/read | Get the list of exports for a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/read | Get detailed performance information about an iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/delete | Unpublish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/delete | Delete a set of predicted images and their associated prediction results. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/image/action | Quick test an image. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/url/action | Quick test an image url. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/delete | Delete a tag from the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/read | Get information about a specific tag. Get the tags for a given project and iteration.* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/write | Update a tag. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/train/advanced/action | Queues project for training with PipelineConfiguration and training type. |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/refresh/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/prediction/user/read | Get usage for prediction resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/resource/tier/read | Get usage for training resource for Azure user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/user/read | Get usage for training resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/state/write | Update user state |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/tier/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/users/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/delete | Deletes an allowlisted user with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/read | Gets a list of allowlisted users with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/write | Updates or creates a user in the allowlist with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision/classify/iterations/image/action | Classify an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/classify/iterations/url/action | Classify an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/classify/iterations/image/nostore/action | Classify an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/classify/iterations/url/nostore/action | Classify an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/detect/iterations/image/action | Detect objects in an image and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/detect/iterations/url/action | Detect objects in an image url and saves the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/detect/iterations/image/nostore/action | Detect objects in an image without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/detect/iterations/url/nostore/action | Detect objects in an image url without saving the result. |
> | Microsoft.CognitiveServices/accounts/CustomVision/domains/read | Get information about a specific domain. Get a list of the available domains.* |
> | Microsoft.CognitiveServices/accounts/CustomVision/labelproposals/setting/action | Set pool size of Label Proposal. |
> | Microsoft.CognitiveServices/accounts/CustomVision/labelproposals/setting/read | Get pool size of Label Proposal for this project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/project/migrate/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/action | This API accepts body content as multipart/form-data and application/octet-stream. When using multipart |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/action | Create a tag for the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/delete | Delete a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/read | Get a specific project. Get your projects.* |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/train/action | Queues project for training. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/write | Update a specific project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/import/action | Imports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/artifacts/read | Get artifact content from blob storage, based on artifact relative path in the blob. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/export/read | Exports a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/regions/action | This API accepts a batch of image regions, and optionally tags, to update existing images with region information. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/files/action | This API accepts a batch of files, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/predictions/action | This API creates a batch of images from predicted images specified. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/urls/action | This API accepts a batch of urls, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/tags/action | Associate a set of images with a set of tags. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/delete | Delete images from the set of training images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/regionproposals/action | This API will get region proposals for an image along with confidences for the region. It returns an empty array if no proposals are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/suggested/action | This API will fetch untagged images filtered by suggested tags Ids. It returns an empty array if no images are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/metadata/action | This API accepts a batch of image Ids, and metadata, to update images. There is a limit of 64 images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/id/read | This API will return a set of Images for the specified tags and optionally iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/regions/delete | Delete a set of image regions. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/suggested/count/action | This API takes in tagIds to get count of untagged images per suggested tags for a given threshold. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/tagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/tagged/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/tags/delete | Remove a set of tags from a set of images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/untagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/images/untagged/count/read | This API returns the images which have no tags for a given project and optionally an iteration. If no iteration is specified the |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/delete | Delete a specific iteration of a project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/export/action | Export a trained iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/read | Get a specific iteration. Get iterations for the project.* |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/publish/action | Publish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/write | Update a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/export/read | Get the list of exports for a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/performance/read | Get detailed performance information about an iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/performance/images/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/performance/images/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/iterations/publish/delete | Unpublish a specific iteration. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/delete | Delete a set of predicted images and their associated prediction results. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/quicktest/image/action | Quick test an image. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/quicktest/url/action | Quick test an image url. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/delete | Delete a tag from the project. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/read | Get information about a specific tag. Get the tags for a given project and iteration.* |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/tags/write | Update a tag. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | Microsoft.CognitiveServices/accounts/CustomVision/projects/train/advanced/action | Queues project for training with PipelineConfiguration and training type. |
> | Microsoft.CognitiveServices/accounts/CustomVision/quota/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/quota/refresh/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/usage/prediction/user/read | Get usage for prediction resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision/usage/training/resource/tier/read | Get usage for training resource for Azure user |
> | Microsoft.CognitiveServices/accounts/CustomVision/usage/training/user/read | Get usage for training resource for Oxford user |
> | Microsoft.CognitiveServices/accounts/CustomVision/user/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/user/state/write | Update user state |
> | Microsoft.CognitiveServices/accounts/CustomVision/user/tier/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/users/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/CustomVision/whitelist/delete | Deletes an allowlisted user with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision/whitelist/read | Gets a list of allowlisted users with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVision/whitelist/write | Updates or creates a user in the allowlist with specific capability |
> | Microsoft.CognitiveServices/accounts/CustomVoice/endpoints/action | Operations (disable/suspend/resume etc.) on an existing voice endpoint |
> | Microsoft.CognitiveServices/accounts/CustomVoice/models/action | Operations like model copy or model saveas. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/evaluations/action | Creates a new evaluation. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/action | Trial project actions |
> | Microsoft.CognitiveServices/accounts/CustomVoice/synthesis/action | Synthesis actions |
> | Microsoft.CognitiveServices/accounts/CustomVoice/chatbot/read | Chat with chatbot. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/consents/write | Create Consent |
> | Microsoft.CognitiveServices/accounts/CustomVoice/consents/delete | Delete Consent |
> | Microsoft.CognitiveServices/accounts/CustomVoice/consents/read | Get consents |
> | Microsoft.CognitiveServices/accounts/CustomVoice/consents/templates/read | Get Consent Templates |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/write | Create or update a dataset. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/delete | Deletes the voice dataset with the given id. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/read | Gets one or more datasets. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/blocks/read | Get one or more uploaded blocks |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/blocks/write | Create or update a dataset blocks |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/files/read | Gets the files of the dataset identified by the given ID. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/datasets/utterances/read | Gets utterances of the specified training set. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/discount/read | Get the discount for neural model training. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/endpoints/write | Create or update an voice endpoint. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/endpoints/delete | Delete the specified voice endpoint. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/endpoints/read | Get one or more voice endpoints |
> | Microsoft.CognitiveServices/accounts/CustomVoice/endpoints/manifest/read | Returns an endpoint manifest which can be used in an on-premise container. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/evaluations/delete | Deletes the specified evaluation. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/evaluations/read | Gets details of one or more evaluations |
> | Microsoft.CognitiveServices/accounts/CustomVoice/features/read | Gets a list of allowed features. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/histories/read | Generic query report API for endpoint billing history, model training hours history etc. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/longaudiosynthesis/delete | Deletes the specified long audio synthesis task. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/longaudiosynthesis/read | Gets one or more long audio syntheses. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/longaudiosynthesis/write | Create or update a long audio synthesis. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/models/write | Create or update a voice model. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/models/delete | Deletes the voice model with the given id. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/models/read | Gets one or more voice models. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/operations/read | Gets status of a given operation. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/write | Create or update a project. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/delete | Deletes the project identified by the given ID. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/read | Gets one or more projects. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/read | Gets one or more trial projects. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/projects/zeroshots/read | Get personal voice prompts for project |
> | Microsoft.CognitiveServices/accounts/CustomVoice/quotas/instantvoice/read | Get personal voice trial quota |
> | Microsoft.CognitiveServices/accounts/CustomVoice/speakerauthorizations/delete | Deletes the specified speaker authorization. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/speakerauthorizations/read | Get the list of speaker authorizations for specified project. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/speakerauthorizations/write | Updates the mutable details of the voice speaker authorization identified by its ID. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/speakerauthorizations/templates/read | Get Consent Templates. |
> | Microsoft.CognitiveServices/accounts/CustomVoice/synthesis/scripts/read | Get Synthesis Scripts |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/write | Create personal voice prompt |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/delete | Delete personal voice prompt |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/read | Get personal voice prompt |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/audioprompts/read | Get recording audios for personal voice prompt |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/basemodels/read | Get personal voice base models |
> | Microsoft.CognitiveServices/accounts/CustomVoice/zeroshots/recordingscripts/read | Get recording scripts |
> | Microsoft.CognitiveServices/accounts/EntitySearch/search/action | Get entities and places results for a given query. |
> | Microsoft.CognitiveServices/accounts/Face/detect/action | Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes. |
> | Microsoft.CognitiveServices/accounts/Face/findsimilars/action | Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list. faceId |
> | Microsoft.CognitiveServices/accounts/Face/group/action | Divide candidate faces into groups based on face similarity. |
> | Microsoft.CognitiveServices/accounts/Face/identify/action | 1-to-many identification to find the closest matches of the specific query person face from a person group or large person group. |
> | Microsoft.CognitiveServices/accounts/Face/verify/action | Verify whether two faces belong to a same person or whether one face belongs to a person. |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/action | Take a snapshot for an object. |
> | Microsoft.CognitiveServices/accounts/Face/persons/action | Creates a new person in a person directory. |
> | Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/action | <p>Performs liveness detection on a target face in a sequence of images of the same modality (e.g. color or infrared), and returns the liveness classification of the target face as either &lsquo;real face&rsquo;, &lsquo;spoof face&rsquo;, or &lsquo;uncertain&rsquo; if a classification cannot be made with the given inputs.</p> |
> | Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/sessions/action | A session is best for client device scenarios where developers want to authorize a client device to perform only a liveness detection without granting full access to their resource. Created sessions have a limited life span and only authorize clients to perform the desired action before access is expired. |
> | Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/sessions/delete | Delete all session related information for matching the specified session id. |
> | Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/sessions/read | Lists sessions for /detectLiveness/SingleModal. |
> | Microsoft.CognitiveServices/accounts/Face/detectliveness/singlemodal/sessions/audit/read | Gets session requests and response body for the session. |
> | Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/action | Detects liveness of a target face in a sequence of images of the same stream type (e.g. color) and then compares with VerifyImage to return confidence score for identity scenarios. |
> | Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/sessions/action | A session is best for client device scenarios where developers want to authorize a client device to perform only a liveness detection without granting full access to their resource. Created sessions have a limited life span and only authorize clients to perform the desired action before access is expired. |
> | Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/sessions/delete | Delete all session related information for matching the specified session id. <br/><br/> |
> | Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/sessions/read | Lists sessions for /detectLivenessWithVerify/SingleModal. |
> | Microsoft.CognitiveServices/accounts/Face/detectlivenesswithverify/singlemodal/sessions/audit/read | Gets session requests and response body for the session. |
> | Microsoft.CognitiveServices/accounts/Face/dynamicpersongroups/write | Creates a new dynamic person group with specified dynamicPersonGroupId, name, and user-provided userData.<br>Update an existing dynamic person group name, userData, add, or remove persons.<br>The properties keep unchanged if they are not in request body.* |
> | Microsoft.CognitiveServices/accounts/Face/dynamicpersongroups/delete | Deletes an existing dynamic person group with specified dynamicPersonGroupId. Deleting this dynamic person group only delete the references to persons data. To delete actual person see PersonDirectory Person - Delete. |
> | Microsoft.CognitiveServices/accounts/Face/dynamicpersongroups/read | Retrieve the information of a dynamic person group, including its name and userData. This API returns dynamic person group information List all existing dynamic person groups by dynamicPersonGroupId along with name and userData.* |
> | Microsoft.CognitiveServices/accounts/Face/dynamicpersongroups/persons/read | List all persons in the specified dynamic person group. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/write | Create an empty face list with user-specified faceListId, name, an optional userData and recognitionModel. Up to 64 face lists are allowed Update information of a face list, including name and userData.* |
> | Microsoft.CognitiveServices/accounts/Face/facelists/delete | Delete a specified face list. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/read | Retrieve a face list's faceListId, name, userData, recognitionModel and faces in the face list. List face lists' faceListId, name, userData and recognitionModel. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/write | Add a face to a specified face list, up to 1,000 faces. |
> | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/delete | Delete a face from a face list by specified faceListId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/write | Create an empty large face list with user-specified largeFaceListId, name, an optional userData and recognitionModel. Update information of a large face list, including name and userData.* |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/delete | Delete a specified large face list. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/read | Retrieve a large face list's largeFaceListId, name, userData and recognitionModel. List large face lists' information of largeFaceListId, name, userData and recognitionModel. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/train/action | Submit a large face list training task. Training is a crucial step that only a trained large face list can use. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/write | Add a face to a specified large face list, up to 1,000,000 faces. Update a specified face's userData field in a large face list by its persistedFaceId.* |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/delete | Delete a face from a large face list by specified largeFaceListId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/read | Retrieve persisted face in large face list by largeFaceListId and persistedFaceId. List faces' persistedFaceId and userData in a specified large face list.* |
> | Microsoft.CognitiveServices/accounts/Face/largefacelists/training/read | To check the large face list training status completed or still ongoing. LargeFaceList Training is an asynchronous operation |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/write | Create a new large person group with user-specified largePersonGroupId, name, an optional userData and recognitionModel. Update an existing large person group's name and userData. The properties keep unchanged if they are not in request body.* |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/delete | Delete an existing large person group with specified personGroupId. Persisted data in this large person group will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/read | Retrieve the information of a large person group, including its name, userData and recognitionModel. This API returns large person group information List all existing large person groups' largePersonGroupId, name, userData and recognitionModel. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/train/action | Submit a large person group training task. Training is a crucial step that only a trained large person group can use. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/action | Create a new person in a specified large person group. To add face to this person, please call |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/delete | Delete an existing person from a large person group. The persistedFaceId, userData, person name and face feature(s) in the person entry will all be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face feature(s). List all persons' information in the specified large person group, including personId, name, userData and persistedFaceIds. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/write | Update name or userData of a person. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/write | Add a face to a person into a large person group for face identification or verification. To deal with an image containing Update a person persisted face's userData field.* |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/delete | Delete a face from a person in a large person group by specified largePersonGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its largePersonGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/largepersongroups/training/read | To check large person group training status completed or still ongoing. LargePersonGroup Training is an asynchronous operation |
> | Microsoft.CognitiveServices/accounts/Face/operations/read | Get status of a snapshot operation. Get status of a long running operation.* |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/write | Create a new person group with specified personGroupId, name, user-provided userData and recognitionModel. Update an existing person group's name and userData. The properties keep unchanged if they are not in request body.* |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/delete | Delete an existing person group with specified personGroupId. Persisted data in this person group will be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/read | Retrieve person group name, userData and recognitionModel. To get person information under this personGroup, use List person groups' personGroupId, name, userData and recognitionModel. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/train/action | Submit a person group training task. Training is a crucial step that only a trained person group can use. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/action | Create a new person in a specified person group. To add face to this person, please call |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/delete | Delete an existing person from a person group. The persistedFaceId, userData, person name and face feature(s) in the person entry will all be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face feature(s). List all persons' information in the specified person group, including personId, name, userData and persistedFaceIds of registered. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/write | Update name or userData of a person. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/write | Add a face to a person into a person group for face identification or verification. To deal with an image containing Update a person persisted face's userData field.* |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/delete | Delete a face from a person in a person group by specified personGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its personGroupId, personId and persistedFaceId. |
> | Microsoft.CognitiveServices/accounts/Face/persongroups/training/read | To check person group training status completed or still ongoing. PersonGroup Training is an asynchronous operation triggered |
> | Microsoft.CognitiveServices/accounts/Face/persons/delete | Delete an existing person from person directory. The persistedFaceId(s), userData, person name and face feature(s) in the person entry will all be deleted. Delete an existing person from person directory The persistedFaceId(s), userData, person name and face feature(s) in the person entry will all be deleted. |
> | Microsoft.CognitiveServices/accounts/Face/persons/read | Retrieve a person's name and userData from person directory. List all persons   information in person directory, including personId, name, and userData. Retrieve a person's name and userData from person directory.* List all persons' information in person directory, including personId, name, and userData. |
> | Microsoft.CognitiveServices/accounts/Face/persons/write | Update name or userData of a person. Update name or userData of a person.* |
> | Microsoft.CognitiveServices/accounts/Face/persons/dynamicpersongroupreferences/read | List all dynamic person groups a person has been referenced by in person directory. |
> | Microsoft.CognitiveServices/accounts/Face/persons/recognitionmodels/persistedfaces/write | Add a face to a person (see PersonDirectory Person - Create) for face identification or verification.<br>To deal with an image containing Update a person persisted face's userData field.* Add a face to a person (see PersonDirectory Person - Create) for face identification or verification.<br>To deal with an image containing* Update a person persisted face's userData field.* |
> | Microsoft.CognitiveServices/accounts/Face/persons/recognitionmodels/persistedfaces/delete | Delete a face from a person in person directory by specified personId and persistedFaceId. Delete a face from a person in person directory by specified personId and persistedFaceId.* |
> | Microsoft.CognitiveServices/accounts/Face/persons/recognitionmodels/persistedfaces/read | Retrieve person face information.<br>The persisted person face is specified by its personId.<br>recognitionModel, and persistedFaceId.<br>Retrieve a person's persistedFaceIds representing the registered person face feature(s).<br>* Retrieve person face information.<br>The persisted person face is specified by its personId.<br>recognitionModel, and persistedFaceId.* Retrieve a person's persistedFaceIds representing the registered person face feature(s).<br>* |
> | Microsoft.CognitiveServices/accounts/Face/session/start/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/Face/session/attempt/end/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/Face/session/sessionimages/read | Gets session image by sessionImageId. |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/apply/action | Apply a snapshot, providing a user-specified object id.* |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/delete | Delete a snapshot. |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/read | Get information of a snapshot. List all of the user's accessible snapshots with information. |
> | Microsoft.CognitiveServices/accounts/Face/snapshots/write | Update properties of a snapshot. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:analyze/action | Analyze document with prebuilt or custom models. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/read/action | Internal usage |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:build/action | Trains a custom document analysis model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:compose/action | Creates a new model from document types of existing models. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:copyto/action | Copies model to the target resource, region, and modelId. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:authorizecopy/action | Generates authorization to copy a model to this location with specified modelId and optional description. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers:authorizecopy/action | Generates authorization to copy a document classifier to this location with |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers:analyze/action | Classifies document with document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers:copyto/action | Copies document classifier to the target resource, region, and classifierId. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:analyzebatch/action | Analyzes batch documents with document model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:analyze/action | Analyzes document with document model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:authorizecopy/action | Generates authorization to copy a document model to this location with |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:copyto/action | Copies document model to the target resource, region, and modelId. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingProjects:upgrade/action | Labeling - Upgrade Labeling Project |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/analysis/analyze/document/action | Analyze Document. Support prebuilt models or custom trained model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/analysis/batchanalyze/document/action | Batch Analyze Documents. Support prebuilt models or custom trained model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/analysis/get/analyze/result/read | Gets the result of document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/analysis/get/batchanalyze/result/read | Gets the result of batch document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classification/analyze/document/action | Classify document. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classification/get/analyze/result/read | Gets the result of document classification. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/write | Classification - Create Classification Task Classification - Update Classification Task |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/read | Classification - Get Classification Task Classification - List Classification Tasks |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/delete | Classification - Delete Classification Task |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/docTypes/write | Classification - Create Label File |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/docTypes/read | Classification - Get Label File Classification - List Label Files |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/docTypes/delete | Classification - Delete Label File |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/write | Classification - Create Document |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/read | Classification - Get Document Classification - List Documents |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/delete | Classification - Delete Document |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/ocr/read | Classification - Get OCR File |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/ocr:analyze/write | Classification - Create OCR File |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/classificationProjects/documents/ocr/operations/read | Classification - Get OCR Creation Operation Classification - List OCR Creation Operations |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/creation/build/action | Builds a custom document analysis model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/creation/classify/action | Builds a custom document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/creation/compose/model/action | Creates a new model from document types of existing models. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/creation/copy/model/action | Copy a custom Form Recognizer model from one subscription to another.<br>Start the process by obtaining a `modelId` token from the target endpoint by using this API with `source=false` query string.<br>Then pass the `modelId` reference in the request body along with other target resource information. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/creation/generate/copyauthorization/action | Generate authorization payload to copy a model at the target Form Recognizer resource. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/train/action | Create and train a custom model.<br>The train request must include a source parameter that is either an externally accessible Azure Storage blob container Uri (preferably a Shared Access Signature Uri) or valid path to a data folder in a locally mounted drive.<br>When local paths are specified, they must follow the Linux/Unix path format and be an absolute path rooted to the input mount configuration |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/action | Create and train a custom model.<br>The request must include a source parameter that is either an externally accessible Azure storage blob container Uri (preferably a Shared Access Signature Uri) or valid path to a data folder in a locally mounted drive.<br>When local paths are specified, they must follow the Linux/Unix path format and be an absolute path rooted to the input mount configuration setting value e.g., if '{Mounts:Input}' configuration setting value is '/input' then a valid source path would be '/input/contosodataset'.<br>All data to be trained is expected to be under the source folder or sub folders under it.<br>Models are trained using documents that are of the following content type - 'application/pdf', 'image/jpeg', 'image/png', 'image/tiff'.<br>Other type of content is ignored. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyze/action | Extract key-value pairs from a given document. The input document must be of one of the supported content types - 'application/pdf', 'image/jpeg' or 'image/png'. A success response is returned in JSON. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/delete | Delete model artifacts. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/read | Get information about a model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copyauthorization/action | Generate authorization payload to copy a model at the target Form Recognizer resource. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copy/action | Copy a custom Form Recognizer model from one subscription to another.<br>Start the process by obtaining a `modelId` token from the target endpoint by using this API with `source=false` query string.<br>Then pass the `modelId` reference in the request body along with other target resource information. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyze/action | Extract key-value pairs, tables, and semantic values from a given document.<br>The input document must be of one of the supported content types - 'application/pdf', 'image/jpeg', 'image/png' or 'image/tiff'.<br>Alternatively, use 'application/json' type to specify the Url location of the document to be analyzed. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copy/action | Copy a custom Form Recognizer model to a target Form Recognizer resource. Before invoking this operation, you must first obtain authorization to copy into  |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/delete | Mark model for deletion. Model artifacts will be permanently removed within 48 hours. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copyauthorization/action | Generate authorization payload for a model copy operation. This operation is called against a target Form Recognizer resource endpoint  |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/read | Get detailed information about a custom model. Get information about all custom models |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/compose/action | Compose request would include list of models ids. It would validate what all models either trained with labels model or composed model. It would validate limit of models put together. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyzeresults/read | Obtain current status and the result of the analyze form operation. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyzeresults/read | Obtain current status and the result of the analyze form operation. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copyresults/read | Obtain current status and the result of the custom form model copy operation. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/copyresults/read | Obtain current status and the result of the custom form model copy operation. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/keys/read | Retrieve the keys for the model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers/delete | Deletes document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers/read | Gets detailed document classifier information. List all document classifiers.* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers:build/write | Builds a custom document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentclassifiers/analyzeresults/read | Gets the result of document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/delete | Mark model for deletion. Model artifacts will be permanently removed within 48 hours. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/read | Get detailed information about a custom model. Get information about all custom models* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/delete | Deletes document model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/read | Gets detailed document model information. List all document models* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/write | Updates document model information. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:build/write | Builds a custom document analysis model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels:compose/write | Creates a new document model from document types of existing document models. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/analyzebatchresults/read | Gets the result of batch document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/analyzeresults/read | Get document analyze result from specified {modelId} and {resultId} |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/analyzeresults/read | Gets the result of document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/analyzeresults/figures/read | Gets the generated cropped image of specified figure from document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/documentmodels/analyzeresults/pdf/read | Gets the generated searchable PDF output from document analysis. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/info/read | Return basic info about the current resource. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/info/read | Return information about the current resource. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/write | Create labeling project. Fail if projectId already exists. Update lableing project. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/read | Get lableing project. List lableing projects. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/delete | Delete lableing project. The project and metadata will be deleted. Documents/labels in user provided storage account will NOT be deleted. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/schema:suggest/action | Suggest schema based on existing documents associated with labeling project. Returns suggested schema without updating actual project schema. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/schema:edit/action | Set/edit field schema. Update all existing labels in the project to reflect edits. Field schema is initially empty. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels:analyze/action | Analyze labeling project document. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/write | Create label of a labeling project. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/read | Get label of a labeling project. List labels of a labeling project. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/delete | Delete a label of a labeling project. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/document/write | Set input document. Cannot be updated. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/document/read | Get input document. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/ocr/read | Get OCR result. OCR result does not contain predicted document fields. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingProjects/labels/ocr/write | Labeling - Create Label OCR |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/labels/operations/read | List analyze document results. Get analyze document result. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingProjects/operations/read | Labeling - Get Labeling Operation Labeling - List Labeling Operations |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/schema/read | Get current schema. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingProjects/schema/write | Labeling - Create schema |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingProjects/schema/delete | Labeling - Delete schema |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/schema/operations/read | Get suggested schema. List suggested schemas. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/labelingprojects/stats/read | Get project level labeling statistics. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/layout/analyze/action | Extract text and layout information from a given document.<br>The input document must be of one of the supported content types - 'application/pdf', 'image/jpeg', 'image/png' or 'image/tiff'.<br>Alternatively, use 'application/json' type to specify the Url location of the document to be analyzed. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/layout/analyzeresults/read | Track the progress and obtain the result of the analyze layout operation |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/management/classifier/delete | Deletes document classifier. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/management/get/classifier/read | List all document classifiers. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/management/get/info/read | Return basic info about the current resource. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/management/get/model/read | Get information about a model. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/management/model/delete | Delete model artifacts. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/operation/get/operation/read | Gets operation. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/operation/list/operations/read | Lists operations. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/operations/read | Gets operation info. Lists all operations.* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/operations/read | Gets operation info. Lists all operations.* |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/businesscard/analyze/action | Extract field text and semantic values from a given business card document.  |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/businesscard/analyzeresults/read | Query the status and retrieve the result of an Analyze Business Card operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Business Card response. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/iddocument/analyze/action | Extract field text and semantic values from a given Id document. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/iddocument/analyzeresults/read | Query the status and retrieve the result of an Analyze Id operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Id response. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/invoice/analyze/action | Extract field text and semantic values from a given invoice document. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/invoice/analyzeresults/read | Query the status and retrieve the result of an Analyze Invoice operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Invoice response. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/asyncbatchanalyze/action | Extract field text and semantic values from a given receipt document. The input document must be of one of the supported |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/analyzeresults/read | Query the status and retrieve the result of an Analyze Receipt operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Receipt response. |
> | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/operations/read | Query the status and retrieve the result of an Analyze Receipt operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Receipt response. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/onco-phenotype/jobs/write | Creates an Onco Phenotype job with the given request body. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/onco-phenotype/jobs/read | Gets the status and details of the Onco Phenotype job. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/patient-timeline/jobs/write | Creates a Patient Timeline job with the given request body. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/patient-timeline/jobs/read | Gets the status and details of the Patient Timeline job. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/radiology-insights/jobs/write | Creates a Radiology Insights job with the given request body. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/radiology-insights/jobs/read | Gets the status and details of the Radiology Insights job. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/trial-matcher/cosmosdb/executeAction/action | Trial Matcher CosmosDB Proxy POST |
> | Microsoft.CognitiveServices/accounts/HealthInsights/trial-matcher/cosmosdb/read | Trial Matcher CosmosDB Proxy GET |
> | Microsoft.CognitiveServices/accounts/HealthInsights/trial-matcher/jobs/write | Creates a Trial Matcher job with the given request body. |
> | Microsoft.CognitiveServices/accounts/HealthInsights/trial-matcher/jobs/read | Gets the status and details of the Trial Matcher job. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/details/action | Returns insights about an image, such as webpages that include the image. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/search/action | Get relevant images for a given query. |
> | Microsoft.CognitiveServices/accounts/ImageSearch/trending/action | Get currently trending images. |
> | Microsoft.CognitiveServices/accounts/ImmersiveReader/getcontentmodelforreader/action | Creates an Immersive Reader session |
> | Microsoft.CognitiveServices/accounts/Knowledge/entitymatch/action | Entity Match* |
> | Microsoft.CognitiveServices/accounts/Knowledge/entities:annotate/action | Search annotation* |
> | Microsoft.CognitiveServices/accounts/Knowledge/annotation/dataverse/action | Dataverse search annotation |
> | Microsoft.CognitiveServices/accounts/Knowledge/dbdata/answer/action | DBDataAnswer |
> | Microsoft.CognitiveServices/accounts/Knowledge/dbvalue/create/action | DBValueCreate* |
> | Microsoft.CognitiveServices/accounts/Knowledge/dbvalue/update/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/Knowledge/nl2sq/api/nl2sq/predict/action | NL2SQL Predict* |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/action | Answer Knowledgebase. |
> | Microsoft.CognitiveServices/accounts/Language/query-text/action | Answer Text. |
> | Microsoft.CognitiveServices/accounts/Language/query-dataverse/action | Query Dataverse. |
> | Microsoft.CognitiveServices/accounts/Language/generate-questionanswers/action | Submit a Generate question answers Job request. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/action | Analyzes the input conversation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/action | Submit a collection of text documents for analysis.  Specify a single unique task to be executed immediately. |
> | Microsoft.CognitiveServices/accounts/Language/:migratefromluis/action | Triggers a job to migrate one or more LUIS apps. |
> | Microsoft.CognitiveServices/accounts/Language/generate/action | Language generation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversation/jobscancel/action | Cancel a long-running analysis job on conversation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversation/jobs/action | Submit a long conversation for analysis. Specify one or more unique tasks to be executed as a long-running operation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversation/jobs/read | Get the status of an analysis job.  A job may consist of one or more tasks.  Once all tasks are succeeded, the job will transition to the suceeded state and results will be available for each task. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/jobscancel/action | Cancel a long-running analysis job on conversation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/jobs/action | Submit a long conversation for analysis. Specify one or more unique tasks to be executed as a long-running operation. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/run-gpt/action | Trigger GPT job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/submit-gpt-prediction-decisions/action | Trigger job to submit decisions on accepting, rejecting, or modifying GPT predictions. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/export/jobs/result/read | Get export job result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/gpt-predictions/read | Get GPT predictions result. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/models/read | Get a trained model info. Get trained models info.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/models/modelguidance/read | Get trained model guidance. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/run-gpt/jobs/read | Get GPT prediction jobs. Get GPT predictions status and result details.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/internal/projects/submit-gpt-prediction-decisions/jobs/read | Get submit GPT prediction decisions job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/jobs/read | Get the status of an analysis job.  A job may consist of one or more tasks.  Once all tasks are succeeded, the job will transition to the suceeded state and results will be available for each task. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/write | Creates a new or update a project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/delete | Deletes a project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/read | Gets a project info. Returns the list of projects.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/export/action | Triggers a job to export project data in JSON format. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/import/action | Triggers a job to import a project in JSON format. If a project with the same name already exists, the data of that project is replaced. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/train/action | Trigger training job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/copy/action | Copies an existing project to another Azure resource. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/authorize-copy/action | Generates a copy project operation authorization to the current target Azure resource. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/copy/jobs/read | Gets the status of an existing copy project job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deletion/jobs/read | Get project deletion job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/read | Get a deployment info. List all deployments.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/delete | Delete a deployment. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/write | Trigger a new deployment or replace an existing one. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/swap/action | Trigger job to swap two deployments. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/delete-from-resources/action | Deletes a project deployment from the specified assigned resources. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/delete-from-resources/jobs/read | Gets the status of an existing delete deployment from specific resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/jobs/read | Get deployment job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/deployments/swap/jobs/read | Gets a swap deployment job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/export/jobs/read | Get export job status details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/export/jobs/result/read | Get export job result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/exported-models/write | Creates a new exported model or replaces an existing one. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/exported-models/delete | Deletes an existing exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/exported-models/read | Gets the details of an exported model. Lists the exported models belonging to a project.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/exported-models/jobs/read | Gets the status for an existing job to create or update an exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/exported-models/manifest/read | Gets the details and URL needed to download the exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/deletion-jobs/read | Get project deletion job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/deployments/resources/read | Lists the deployments to which an Azure resource is assigned. This doesn't return deployments belonging to projects owned by this resource. It only returns deployments belonging to projects owned by other resources. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/languages/read | Get List of Supported languages. Get List of Supported languages.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/prebuilt-entities/read | Get list of Supported prebuilts for conversational projects. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/prebuilts/read | Get list of Supported prebuilts for conversational projects. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/global/training-config-versions/read | List all training config versions. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/import/jobs/read | Get import or replace project job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/languages/read | Get List of Supported languages. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/delete | Delete a trained model. Delete a trained model.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/read | Get a trained model info. List all trained models.* Get a trained model info.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/load-snapshot/action | Restores the snapshot of this trained model to be the current working directory of the project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/evaluate/action | Triggers evaluation operation on a trained model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/evaluate/jobs/read | Gets the status for an evaluation job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/evaluation/read | Get trained model evaluation report. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/evaluation/result/read | Get trained model evaluation result. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/evaluation/summary-result/read | Get trained model evaluation summary. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/load-snapshot/jobs/read | Gets the status for loading a snapshot. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/models/verification/read | Get trained model verification report. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/prebuilts/read | Get list of Supported prebuilts for conversational projects. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/resources/assign/action | Assign new Azure resources to a project to allow deploying new deployments to them.<br>This API is available only via AAD authentication and not supported via subscription key authentication.<br>For more details about AAD authentication, check here: [Authenticate with Azure Active Directory](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory) |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/resources/read | Lists the deployments resources assigned to the project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/resources/unassign/action | Unassign resources from a project. This disallows deploying new deployments to these resources, and deletes existing deployments assigned to them. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/resources/assign/jobs/read | Gets the status of an existing assign deployment resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/resources/unassign/jobs/read | Gets the status of an existing unassign deployment resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/train/jobs/read | Get training jobs. Get training job status and result details.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-conversations/projects/train/jobs/cancel/action | Cancels a running training job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-documents/jobs/action | Submit documents analysis job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-documents/jobscancel/action | Cancel a long-running Documents Analysis job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-documents/jobs/read | Get the status of an analysis job.  A job may consist of one or more tasks.  Once all tasks are completed, the job will transition to the completed state and results will be available for each task. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/jobs/action | Submit a collection of text documents for analysis. Specify one or more unique tasks to be executed. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/jobscancel/action | Cancel a long-running Text Analysis job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/autotag/action | Trigger auto tagging job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/run-gpt/action | Trigger GPT job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/submit-gpt-prediction-decisions/action | Trigger job to submit decisions on accepting, rejecting, or modifying GPT predictions. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/autotag/jobs/read | Get autotagging jobs. Get auto tagging job status and result details.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/export/jobs/result/read | Get export job result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/gpt-predictions/read | Get GPT predictions result. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/models/read | Get a trained model info. Get trained models info.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/models/modelguidance/read | Get trained model guidance. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/run-gpt/jobs/read | Get GPT prediction jobs. Get GPT predictions status and result details.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/internal/projects/submit-gpt-prediction-decisions/jobs/read | Get submit GPT prediction decisions job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/jobs/read | Get the status of an analysis job.  A job may consist of one or more tasks.  Once all tasks are completed, the job will transition to the completed state and results will be available for each task. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/write | Creates a new or update a project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/delete | Deletes a project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/read | Gets a project info. Returns the list of projects.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/export/action | Triggers a job to export project data in JSON format. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/import/action | Triggers a job to import a project in JSON format. If a project with the same name already exists, the data of that project is replaced. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/train/action | Trigger training job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/copy/action | Copies an existing project to another Azure resource. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/authorize-copy/action | Generates a copy project operation authorization to the current target Azure resource. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/copy/jobs/read | Gets the status of an existing copy project job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deletion/jobs/read | Get project deletion job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/read | Get a deployment info. List all deployments.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/delete | Delete a deployment. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/write | Trigger a new deployment or replace an existing one. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/swap/action | Trigger job to swap two deployments. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/delete-from-resources/action | Deletes a project deployment from the specified assigned resources. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/delete-from-resources/jobs/read | Gets the status of an existing delete deployment from specific resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/jobs/read | Get deployment job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/deployments/swap/jobs/read | Gets a swap deployment job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/export/jobs/read | Get export job status details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/export/jobs/result/read | Get export job result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/exported-models/write | Creates a new exported model or replaces an existing one. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/exported-models/delete | Deletes an existing exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/exported-models/read | Gets the details of an exported model. Lists the exported models belonging to a project.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/exported-models/jobs/read | Gets the status for an existing job to create or update an exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/exported-models/manifest/read | Gets the details and URL needed to download the exported model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/global/deletion-jobs/read | Get project deletion job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/global/deployments/resources/read | Lists the deployments to which an Azure resource is assigned. This doesn't return deployments belonging to projects owned by this resource. It only returns deployments belonging to projects owned by other resources. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/global/languages/read | Get List of Supported languages. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/global/prebuilt-entities/read | Lists the supported prebuilt entities that can be used while creating composed entities. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/global/training-config-versions/read | List all training config versions. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/import/jobs/read | Get import or replace project job status and result details. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/languages/read | Get List of Supported languages. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/delete | Delete a trained model. Delete a trained model.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/read | Get a trained model info. List all trained models.* Get a trained model info.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/load-snapshot/action | Restores the snapshot of this trained model to be the current working directory of the project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/evaluate/action | Triggers evaluation operation on a trained model. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/evaluate/jobs/read | Gets the status for an evaluation job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/evaluation/read | Get trained model evaluation report. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/evaluation/result/read | Get trained model evaluation result. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/evaluation/summary-result/read | Get trained model evaluation summary. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/load-snapshot/jobs/read | Gets the status for loading a snapshot. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/models/verification/read | Get trained model verification report. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/resources/assign/action | Assign new Azure resources to a project to allow deploying new deployments to them.<br>This API is available only via AAD authentication and not supported via subscription key authentication.<br>For more details about AAD authentication, check here: [Authenticate with Azure Active Directory](/azure/ai-services/authentication?tabs=powershell#authenticate-with-azure-active-directory) |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/resources/read | Lists the deployments resources assigned to the project. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/resources/unassign/action | Unassign resources from a project. This disallows deploying new deployments to these resources, and deletes existing deployments assigned to them. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/resources/assign/jobs/read | Gets the status of an existing assign deployment resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/resources/unassign/jobs/read | Gets the status of an existing unassign deployment resources job. |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/train/jobs/read | Get training jobs. Get training job status and result details.* |
> | Microsoft.CognitiveServices/accounts/Language/analyze-text/projects/train/jobs/cancel/action | Cancels a running training job. |
> | Microsoft.CognitiveServices/accounts/Language/generate-questionanswers/jobs/read | Get QA generation Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/migratefromluis/jobs/read | Gets the status of a migration job of a batch of LUIS apps. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/read | List Projects. Get Project Details.* |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/write | Create Project. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/delete | Delete Project. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/export/action | Export Project. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/import/action | Import Project. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/feedback/action | Train Active Learning. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/deletion-jobs/read | Get Import Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/deployments/read | Get Project Deployment. List Deployments.* |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/deployments/write | Deploy Project. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/deployments/jobs/read | Get Deploy Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/export/jobs/read | Get Export Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/export/jobs/result/read | Get Export Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/import/jobs/read | Get Import Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/qnas/read | Get QnAs. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/qnas/write | Update QnAs. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/qnas/jobs/read | Get Update QnAs Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/sources/read | Get Sources. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/sources/write | Update QnAs. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/sources/jobs/read | Get Update Sources Job Status. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/synonyms/read | Get Synonyms. |
> | Microsoft.CognitiveServices/accounts/Language/query-knowledgebases/projects/synonyms/write | Update Synonyms. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/action | Creates a new project. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/delete | Deletes a project. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/read | Returns a project. Returns the list of projects.* |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/write | Updates the project info. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/publish/action | Trigger publishing job. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/train/action | Trigger training job. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/cultures/read | Get List of Supported Cultures. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/evaluation/read | Get the evaluation result of a certain training model name. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/publish/jobs/read | Get publishing job status and result details. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/train/jobs/read | Get training job status and result details. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/trainedmodels/read | Get List of Trained Model Info. |
> | Microsoft.CognitiveServices/accounts/LanguageAuthoring/projects/validation/read | Get the validation result of a certain training model name. |
> | Microsoft.CognitiveServices/accounts/LUIS/unlabeled/action | Appends unlabeled data to the corresponding applications |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/write | Creates a new LUIS app. Updates the name or description of the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/azureaccounts/action | Assigns an Azure account to the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/delete | Deletes an application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/read | Gets the application info. Lists all of the user applications. Returns the list of applications* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/import/action | Imports an application to LUIS, the application's JSON should be included in the request body. Returns new app ID. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/publish/action | Publishes a specific version of the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/move/action | Moves the app to a different LUIS authoring Azure resource. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/subscriptions/action | Assigns the subscription information to the specified application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/unlabeled/action | Uploads unlabeled data from csv file to the application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/activeversion/write | Updates the currently active version of the specified app |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/assistants/read | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/azureaccounts/read | Gets the LUIS Azure accounts assigned to the application for the user using his Azure Resource Manager token. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/azureaccounts/delete | Gets the LUIS Azure accounts for the user using his Azure Resource Manager token. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/cultures/read | Gets the supported LUIS application cultures. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/cultures/tokenizerversions/read | Gets the LUIS application culture and supported tokenizer versions for culture. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/customprebuiltdomains/write | Adds a prebuilt domain along with its models as a new application. Returns new app ID. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/customprebuiltdomains/read | Gets all the available custom prebuilt domains for a specific culture Gets all the available custom prebuilt domains for all cultures |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/domains/read | Gets the available application domains. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/endpoints/read | Returns the available endpoint deployment regions and urls |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/metadata/read | Get the application metadata |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/metadata/write | Updates the application metadata |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/permissions/write | Adds a user to the allowed list of users to access this LUIS application. Replaces the current users access list with the one sent in the body.* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/permissions/read | Gets the list of user emails that have permissions to access your application.  |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/permissions/delete | Removed a user to the allowed list of users to access this LUIS application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/publishsettings/read | Get the publish settings for the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/publishsettings/write | Updates the application publish settings. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/querylogs/read | Gets the query logs of the past month for the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/querylogsasync/read | Get the status of the download request for query logs. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/runtimepermissions/bot/action | Adds a bot runtime permission to the application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/runtimepermissions/bot/delete | Deleted a bot runtime application permission |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/runtimepermissions/bot/read | Gets the bot runtime permissions for the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/settings/read | Get the application settings |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/settings/write | Updates the application settings |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/slots/evaluations/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/slots/evaluations/result/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/slots/evaluations/status/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/slots/predict/read | Gets the published predictions for the specified slot using the given query. The current maximum query size is 500 characters. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/stats/detailedendpointhitshistory/read | Gets the endpoint hits history for each day for a given timeframe with slot and region details. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/subscriptions/read | Return the information of the assigned subscriptions for the application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/subscriptions/delete | Removes the subscription with the specified id from the assigned subscriptions for the application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/delete | Deletes a given dataset from a given application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/read | Gets the given batch test meta data. Returns a list of all the batch test datasets of a given application.* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/write | Updates last test results of an existing batch test data set for a given application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/download/read | Downloads the dataset with the given id. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/testdatasets/rename/write | Updates the name of an existing batch test data set for a given application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/usagescenarios/read | Gets the application available usage scenarios. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/train/action | Sends a training request for a version of a specified LUIS application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/clone/action | Creates a new application version equivalent to the current snapshot of the selected application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/delete | Deletes an application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/read | Gets the application version info. Gets the info for the list of application versions. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/import/action | Imports a new version into a LUIS application, the version's JSON should be included in the request body. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/write | Updates the name or description of the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/evaluations/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/releasedispatch/action | Releases a new snapshot of the selected application version to be used by Dispatch applications |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/assignedkey/write | **THIS IS DEPRECATED** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/assignedkey/read | **THIS IS DEPRECATED** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/write | Adds a list entity to the LUIS app. Adds a batch of sublists to an existing closedlist.* Updates the closed list model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/delete | Deletes a closed list entity from the application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/read | Gets information of a closed list model. Gets information about the closedlist models. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/suggest/action | suggest new entries for existing or newly created closed lists |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/presuggestion/read | Loads previous suggestion result for closed list entity. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/roles/write | Adds a role for a closed list entity model Updates a role for a closed list entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/roles/delete | Deletes the role for a closed list entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/roles/read | Gets the role for a closed list entity model. Gets the roles for a closed list entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/sublists/write | Adds a list to an existing closed list Updates one of the closed list's sublists |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/closedlists/sublists/delete | Deletes a sublist of a specified list entity. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/write | Adds a composite entity extractor to the application. Updates the composite entity extractor. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/delete | Deletes a composite entity extractor from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/read | Gets information about the composite entity model. Gets information about the composite entity models of the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/children/write | Adds a single child in an existing composite entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/children/delete | Deletes a composite entity extractor child from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/roles/write | Adds a role for a composite entity model. Updates a role for a composite entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/roles/delete | Deletes the role for a composite entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/compositeentities/roles/read | Gets the role for a composite entity model. Gets the roles for a composite entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/connectedservices/write | Creates the mapping between an intent and a service Updates the mapping between an intent and a service* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/connectedservices/delete | Deletes the mapping between an intent and a service |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/connectedservices/read | Gets the mapping between an intent and a service |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltdomains/write | Adds a customizable prebuilt domain along with all of its models to this application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltdomains/delete | Deletes a prebuilt domain's models from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltentities/write | Adds a custom prebuilt domain entity model to the application version. Use [delete entity](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c1f) with the entity id to remove this entity. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltentities/read | Gets all custom prebuilt domain entities info for this application version |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltentities/roles/write | Adds a role for a custom prebuilt domain entity model Updates a role for a custom prebuilt domain entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltentities/roles/delete | Deletes the role for a custom prebuilt entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltentities/roles/read | Gets the role for a custom prebuilt domain entity model. Gets the roles for a custom prebuilt domain entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltintents/write | Adds a custom prebuilt domain intent model to the application. Use [delete intent](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c1c) with the intent id to remove this intent. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltintents/read | Gets custom prebuilt intents info for this application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltintentsbatch/write | Adds custom prebuilt domain intents to application in batch |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/customprebuiltmodels/read | Gets all custom prebuilt domain models info for this application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/detailedmodels/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/write | Adds a simple entity extractor to the application version. Updates the name of an entity extractor. Updates the entity extractor.* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/delete | Deletes a simple entity extractor from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/read | Gets info about the simple entity model. Gets info about the  simple entity models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/children/write | Creates a single child in an existing entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/features/write | Adds a feature relation for an entity model Updates the list of feature relations for the entity* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/features/delete | Deletes the feature relation for an entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/features/read | Gets the feature relations for an entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/roles/write | Adds a role for a simple entity model Updates a role of a simple entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/roles/delete | Deletes the role for a simple entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/roles/read | Gets the role for a simple entity model. Gets the roles for a simple entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/roles/suggest/read | Suggests examples that would improve the accuracy of the entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/stats/endpointscores/read | Gets the number of times the entity model scored as the top intent |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/entities/suggest/read | Suggests examples that would improve the accuracy of the entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/evaluations/result/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/evaluations/status/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/example/write | Adds a labeled example to the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/examples/write | Adds a batch of non-duplicate labeled examples to the specified application. Batch can't include hierarchical child entities. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/examples/delete | Deletes the label with the specified ID. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/examples/read | Returns a subset of endpoint examples to be reviewed. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/export/read | Exports a LUIS application version to JSON format. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/externalkeys/delete | THIS API IS DEPRECATED. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/externalkeys/read | **THIS IS DEPRECATED** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/externalkeys/write | **THIS IS DEPRECATED** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/features/read | Gets all application version features. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/featuresuggestion/status/read | Get application version feature suggestion status |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/featuresuggestion/suggestions/read | Get application version feature suggestions |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/write | Adds a hierarchical entity extractor to the application version. Updates the name and children of a hierarchical entity extractor model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/delete | Deletes a hierarchical entity extractor from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/read | Gets info about the hierarchical entity model. Gets information about the hierarchical entity models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/children/write | Creates a single child in an existing hierarchical entity model. Renames a single child in an existing hierarchical entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/children/delete | Deletes a hierarchical entity extractor child from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/children/read | Gets info about the hierarchical entity child model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/roles/write | Adds a role for a hierarchical entity model Updates a role for a hierarchical entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/roles/delete | Deletes the role for a hierarchical entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/hierarchicalentities/roles/read | Gets the role for a hierarchical entity model. Gets the roles for a hierarchical entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/write | Adds an intent classifier to the application version. Updates the name of an intent classifier. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/delete | Deletes an intent classifier from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/read | Gets info about the intent model. Gets info about the intent models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/entitiescount/read | Gets the entities count of the labeled utterances for the given intent in the given task in the given app. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/features/write | Adds a feature relation for an intent model Updates the list of feature relations for the intent* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/features/delete | Deletes the feature relation for an intent model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/features/read | Gets the feature relations for an intent model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/patternrules/read | Gets the patterns for a specific intent. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/stats/read | Get application version training stats per intent |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/stats/endpointscores/read | Gets the number of times the intent model scored as the top intent |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/intents/suggest/read | Suggests examples that would improve the accuracy of the intent model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/labeleddata/read | Gets the labeled data for the specified application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/listprebuilts/read | Gets all the available prebuilt entities for the application based on the application's culture. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/read | Gets info about the application version models. Gets information about a model.* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/endpointscoreshistory/read | Gets the number of times the intent model scored as the top intent history given timeframe |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/examples/read | Gets list of model examples. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/review/read | Gets the labeled utterances for the given model in the given task in the given app. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/reviewlabels/read | Gets the labeled utterances for the given model in the given task in the given app. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/models/reviewpredictions/read | Gets the labeled utterances for the given model in the given task in the given app. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/write | Adds a Pattern.any entity extractor to the application version. Updates the Pattern.any entity extractor. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/delete | Deletes a Pattern.any entity extractor from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/read | Gets info about the Pattern.any entity model. Gets info about the Pattern.any entity models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/explicitlist/write | Adds an item to a Pattern.any explicit list. Updates the explicit list item for a Pattern.any entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/explicitlist/delete | Deletes an item from a Pattern.any explicit list. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/explicitlist/read | Gets the explicit list of a Pattern.any entity model. Gets the explicit list item for a Pattern.Any entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/roles/write | Adds a role for a Pattern.any entity model Updates a role for a Pattern.any entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/roles/delete | Deletes the role for a Pattern.any entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternanyentities/roles/read | Gets the role for a Pattern.any entity model. Gets the roles for a Pattern.any entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternrule/write | Adds a pattern to the specified application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternrules/write | Adds a list of patterns to the application version. Updates a pattern in the application version. Updates a list of patterns in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternrules/delete | Deletes a list of patterns from the application version. Deletes a pattern from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patternrules/read | Gets the patterns in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patterns/write | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patterns/delete | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/patterns/read | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/phraselists/write | Creates a new phraselist feature. Updates the phrases, the state and the name of the phraselist feature. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/phraselists/delete | Deletes a phraselist feature from an application. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/phraselists/read | Gets phraselist feature info. Gets all phraselist features for the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/phraselists/suggest/action | suggest new entries for existing or newly created phrase lists |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/phraselists/presuggestion/read | Loads previous suggestion result for phraselist feature. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/write | Adds a list of prebuilt entity extractors to the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/delete | Deletes a prebuilt entity extractor from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/read | Gets info about the prebuilt entity model. Gets info about the prebuilt entity models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/roles/write | Adds a role for a prebuilt entity model Updates a role for a prebuilt entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/roles/delete | Deletes the role for a prebuilt entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/prebuilts/roles/read | Gets the role for a prebuilt entity model. Gets the roles for a prebuilt entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/predict/read | Gets the published predictions for the specified application version using the given query. The current maximum query size is 500 characters. Gets the prediction (intents/entities) for the utterance given.* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/write | Adds a regular expression entity extractor to the application version. Updates the regular expression entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/delete | Deletes a regular expression entity model from the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/read | Gets info about a regular expression entity model. Gets info about the regular expression entity models in the application version. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/roles/write | Adds a role for a regular expression entity model Updates a role for a regular expression entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/roles/delete | Deletes the role for a regular expression entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/regexentities/roles/read | Gets the roles for a regular expression entity model. Gets the role for a regular expression entity model. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/settings/read | Gets the application version settings. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/settings/write | Updates the application version settings. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/state/read | Gets a flag indicating if the app version has been previously trained |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/read | Get application version training stats |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/endpointhitshistory/read | Gets the endpoint hits history for each day for a given timeframe. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/examplesperentity/read | Gets the number of examples per entity of a given application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/labelsperentity/read | Gets the number of labels per entity of a given application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/labelsperintent/read | Gets the number of labels per intent for a given application |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/stats/operations/read | Get application version training stats unexpired operation info Get application version training stats unexpired operations* |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/statsmetadata/read | Get application version training stats metadata |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/suggest/delete | Deleted an endpoint utterance. This utterance is in the "Review endpoint utterances" list. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/testdatasets/run/read | Runs the batch test given by the application id and dataset id on the given |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/train/read | Gets the training status of all models (intents and entities) for the specified application version. You must call the train API to train the LUIS app before you call this API to get training status. |
> | Microsoft.CognitiveServices/accounts/LUIS/apps/versions/trainingstatus/read | Gets a flag indicating if the app version has been previously trained |
> | Microsoft.CognitiveServices/accounts/LUIS/azureaccounts/read | Gets the LUIS Azure accounts for the user using his Azure Resource Manager token. |
> | Microsoft.CognitiveServices/accounts/LUIS/compositesmigration/apps/versions/migrate/action | Migrate composites for application version |
> | Microsoft.CognitiveServices/accounts/LUIS/compositesmigration/apps/versions/operations/migrate/read | Get composite migration result |
> | Microsoft.CognitiveServices/accounts/LUIS/compositesmigration/apps/versions/operations/migrate/status/read | Get composite migration operation status |
> | Microsoft.CognitiveServices/accounts/LUIS/compositesmigration/needmigrationapps/read | Get applications needing composite migrations |
> | Microsoft.CognitiveServices/accounts/LUIS/externalkeys/write | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/externalkeys/delete | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/externalkeys/read | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/package/slot/gzip/read | Packages published LUIS application as GZip |
> | Microsoft.CognitiveServices/accounts/LUIS/package/versions/gzip/read | Packages trained LUIS application as GZip |
> | Microsoft.CognitiveServices/accounts/LUIS/ping/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/predict/read | Gets the published endpoint prediction for the given query. |
> | Microsoft.CognitiveServices/accounts/LUIS/previewfeatures/read | Gets eligibility status of preview features for current owner. |
> | Microsoft.CognitiveServices/accounts/LUIS/programmatickey/write | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/resources/apps/count/read | Gets the number of applications owned by the user. |
> | Microsoft.CognitiveServices/accounts/LUIS/resources/apps/versions/count/read | Gets the number of versions of a given application. |
> | Microsoft.CognitiveServices/accounts/LUIS/subscriptions/write | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/subscriptions/delete | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/subscriptions/read | **THIS API IS DEPRECATED.** |
> | Microsoft.CognitiveServices/accounts/LUIS/user/termsofuse/action | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/delete | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/write | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/authoringazureaccount/write | Migrates the user's APIM authoring key to be an Azure resource. |
> | Microsoft.CognitiveServices/accounts/LUIS/user/collaborators/read | Gets users per app for all apps the user has collaborators on. |
> | Microsoft.CognitiveServices/accounts/LUIS/user/detailedinfo/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/programmatickey/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/programmatickeywithendpointurl/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/LUIS/user/unownedappsowners/read | Gets owners of the apps that user collaborates on. |
> | Microsoft.CognitiveServices/accounts/MaaS/completions/action | Creates a completion for the provided prompt and parameters. |
> | Microsoft.CognitiveServices/accounts/MaaS/embeddings/action | Creates an embedding vector representing the input text. |
> | Microsoft.CognitiveServices/accounts/MaaS/chat/completions/action | Creates a model response for the given chat conversation. |
> | Microsoft.CognitiveServices/accounts/MaaS/images/embeddings/action | Creates an embedding vector representing the input image and text pair. |
> | Microsoft.CognitiveServices/accounts/MaaS/images/generations/action | Creates an image given a prompt and an optional base image. |
> | Microsoft.CognitiveServices/accounts/MaaS/info/read | Returns the information about the model deployed under the endpoint. |
> | Microsoft.CognitiveServices/accounts/MaaS/v1/chat/action | Cohere AI - Chat |
> | Microsoft.CognitiveServices/accounts/MaaS/v1/embed/action | Cohere AI - Embed |
> | Microsoft.CognitiveServices/accounts/MaaS/v1/rerank/action | Rerank |
> | Microsoft.CognitiveServices/accounts/MaaS/v1/chat/completions/action | Chat Completion |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/write | Create or update anomaly alerting configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/delete | Delete anomaly alerting configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/read | Query a single anomaly alerting configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/alerts/query/action | Query alerts under anomaly alerting configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/alerts/anomalies/read | Query anomalies under a specific alert |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/alert/anomaly/configurations/alerts/incidents/read | Query incidents under a specific alert |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/credentials/write | Create or update a new data source credential |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/credentials/delete | Delete a data source credential |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/credentials/read | Get a data source credential or list all credentials |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/write | Create or update a data feed. |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/delete | Delete a data feed |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/read | Get a data feed by its id or list all data feeds |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/ingestionprogress/read | Get data last success ingestion job timestamp by data feed |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/ingestionprogress/reset/action | Reset data ingestion status by data feed to backfill data |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/datafeeds/ingestionstatus/query/action | Get data ingestion status by data feed |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/write | Create or update anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/delete | Delete anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/read | Query a single anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/alert/anomaly/configurations/read | Query all anomaly alerting configurations for specific anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/anomalies/query/action | Query anomalies under anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/anomalies/dimension/query/action | Query dimension values of anomalies |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/incidents/query/action | Query incidents under anomaly detection configuration |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/incidents/rootcause/read | Query root cause for incident |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/enrichment/anomalydetection/configurations/series/query/action | Query series enriched by anomaly detection |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/feedback/metric/write | Create a new metric feedback |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/feedback/metric/read | Get a metric feedback by its id |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/feedback/metric/query/action | List feedback on the given metric |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/hooks/write | Create or update a hook |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/hooks/delete | Delete a hook |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/hooks/read | Get a hook by its id or list all hooks |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/metrics/data/query/action | Get time series data from metric |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/metrics/dimension/query/action | List dimension from certain metric |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/metrics/enrichment/anomalydetection/configurations/read | Query all anomaly detection configurations for specific metric |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/metrics/series/query/action | List series (dimension combinations) from metric |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/metrics/status/enrichment/anomalydetection/query/action | Query anomaly detection status |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/stats/latest/read | Get latest usage stats |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/write | Create or update a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/delete | Delete a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/read | Get a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/write | Create or update an application instance to a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/delete | Delete an application instance from a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/read | Get a time series group's application instance |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/inference/action | Inference time series group application instance model |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/train/action | Train time series group application instance model |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/history/read | Get the running result history from a time series group application instance by its id |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/inferencescore/read | Get the inference score values from a time series group application instance |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/inferenceseverity/read | Get the inference severity values from a time series group application instance |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/latestresult/read | Get the latest running result from a time series group application instance by its id |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/modelstate/read | Get time series group application instance model state |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/ops/read | Get time series group application instance operation records |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/appinstances/ops/inferencestatus/read | Get time series group application instance inference status |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/seriessets/write | Add or update a time series set to a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/seriessets/delete | Delete a time series set from a time series group |
> | Microsoft.CognitiveServices/accounts/MetricsAdvisor/timeseriesgroups/seriessets/read | Get a time series set |
> | Microsoft.CognitiveServices/accounts/ModelDistribution/models/read | Get model manifest for given conditions |
> | Microsoft.CognitiveServices/accounts/ModelDistribution/models/latest/read | Get latest available and compatible model for a specific service. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers:analyze/action | Extract content and fields from input. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/read | List analyzers. Get analyzer properties. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/write | Create a new analyzer asynchronously. Update analyzer properties. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/delete | Delete analyzer. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/operations/read | Get the status of an analyzer creation operation. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/results/read | Get the result of an analysis operation. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/analyzers/results/images/read | Get an image associated with the result of an analysis operation. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/batchAnalysisJobs/read | List all batch analysis jobs. Get batch analysis job. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/batchAnalysisJobs/write | Create a batch analysis job. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/batchAnalysisJobs/delete | Delete batch analysis job.  Analysis output is not deleted. |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/write | Labeling - Create project Labeling - Update project |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/read | Labeling - Get project Labeling - List projects |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/delete | Labeling - Delete project |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/schema:suggest/action | Labeling - Suggest field schema |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/schema:edit/action | Labeling - Edit field schema |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels:analyze/action | Labeling - Analyze document |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/write | Labeling - Create label |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/read | Labeling - Get label Labeling - List labels |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/delete | Labeling - Delete label |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/document/write | Labeling - Set document |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/document/read | Labeling - Get document |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/ocr/read | Labeling - Get OCR result |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/labels/operations/read | Labeling - List analyze document results Labeling - Get analyze document result |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/schema/read | Labeling - Get current schema |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/schema/operations/read | Labeling - Get suggested schema Labeling - List suggested schemas |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/stats/read | Labeling - Get project stats |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/test/files/write | Labeling - Create or update test file |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/test/files/read | Labeling - Get test files Labeling - List test files |
> | Microsoft.CognitiveServices/accounts/MultiModalIntelligence/labelingProjects/test/files/delete | Labeling - Delete Test file |
> | Microsoft.CognitiveServices/accounts/NewsSearch/categorysearch/action | Returns news for a provided category. |
> | Microsoft.CognitiveServices/accounts/NewsSearch/search/action | Get news articles relevant for a given query. |
> | Microsoft.CognitiveServices/accounts/NewsSearch/trendingtopics/action | Get trending topics identified by Bing. These are the same topics shown in the banner at the bottom of the Bing home page. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batches/action | Creates a batch job |
> | Microsoft.CognitiveServices/accounts/OpenAI/issuetoken/action | Issue Cognitive Services jwt token for authentication. |
> | Microsoft.CognitiveServices/accounts/OpenAI/issuescopedtoken/action | Issue scoped Cognitive Services jwt token for authentication. |
> | Microsoft.CognitiveServices/accounts/OpenAI/stored-completions/action | Export completions data using filters |
> | Microsoft.CognitiveServices/accounts/OpenAI/1p-jobs/write | Creates or cancels First party Fine-tune jobs like RLHF jobs (SupervisedFineTuning, RewardModel, ProximalPolicyOptimisation). |
> | Microsoft.CognitiveServices/accounts/OpenAI/1p-jobs/read | Gets information about First party Fine-tune jobs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/write | Create or update assistants. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/read | Get assistants. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/delete | Delete assistants. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/files/write | Create assistant file. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/files/read | Retrieve assistant file. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/files/delete | Delete assistant file. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/write | Create assistant thread. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/read | Retrieve assistant thread. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/delete | Delete assistant thread. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/messages/write | Create assistant thread message. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/messages/read | Retrieve assistant thread message. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/messages/delete | Delete assistant thread message. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/messages/files/read | Retrieve assistant thread message file. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/runs/write | Create or update assistant thread run. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/runs/read | Retrieve assistant thread run. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/threads/runs/steps/read | Retrieve assistant thread run step. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/write | Create or update vector stores. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/read | Get vector stores. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/delete | Delete vector stores. |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/file_batches/write | Update vector store file batches |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/file_batches/read | Read vector store file batches |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/files/write | Write vector stores files |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/files/read | Read vector stores files |
> | Microsoft.CognitiveServices/accounts/OpenAI/assistants/vector_stores/files/delete | Delete vector stores files |
> | Microsoft.CognitiveServices/accounts/OpenAI/batch-jobs/write | Creates Batch Inference jobs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batch-jobs/delete | Deletes Batch Inference jobs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batch-jobs/read | Gets information about batch jobs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batches/read | List or get batch jobs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batches/delete | Delete a batch job. |
> | Microsoft.CognitiveServices/accounts/OpenAI/batches/cancel/action | Cancel a batch job. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/search/action | Search for the most relevant documents using the current engine. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/completions/action | Create a completion from a chosen model. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/realtime/action | Creates a realtime connection to the deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/read | Gets information about deployments. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/write | Create or update deployments. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/delete | Delete deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/embeddings/action | Return the embeddings for a given prompt. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/audio/action | Return the transcript or translation for a given audio file. |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/rainbow/action | Creates a completion for the provided prompt, consisting of text and images |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/chat/completions/action | Creates a completion for the chat message |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/extensions/chat/completions/action | Creates a completion for the chat message with extensions |
> | Microsoft.CognitiveServices/accounts/OpenAI/deployments/usage/read | Gets enqueued token usage for a specified batch deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/read | Read engine information. |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/completions/action | Create a completion from a chosen model |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/search/action | Search for the most relevant documents using the current engine. |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/generate/action | Sample from the model via POST request. |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/generate/action | (Intended for browsers only.) Stream generated text from the model via GET request.<br>This method is provided because the browser-native EventSource method can only send GET requests.<br>It supports a more limited set of configuration options than the POST variant. |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/completions/action | Create a completion from a chosen model |
> | Microsoft.CognitiveServices/accounts/OpenAI/engines/completions/browser_stream/action | (Intended for browsers only.) Stream generated text from the model via GET request.<br>This method is provided because the browser-native EventSource method can only send GET requests.<br>It supports a more limited set of configuration options than the POST variant. |
> | Microsoft.CognitiveServices/accounts/OpenAI/evals/write | Creates or cancels evaluation of a model. |
> | Microsoft.CognitiveServices/accounts/OpenAI/evals/read | Gets information about evaluation runs. |
> | Microsoft.CognitiveServices/accounts/OpenAI/extensions/on-your-data/ingestion/read | Read Operations related to on-your-data feature |
> | Microsoft.CognitiveServices/accounts/OpenAI/extensions/on-your-data/ingestion/write | Write Operations related to on-your-data feature |
> | Microsoft.CognitiveServices/accounts/OpenAI/files/write | Upload or import files. |
> | Microsoft.CognitiveServices/accounts/OpenAI/files/delete | Delete files. |
> | Microsoft.CognitiveServices/accounts/OpenAI/files/read | Gets information about files. |
> | Microsoft.CognitiveServices/accounts/OpenAI/fine-tunes/write | Creates or cancels adaptation of a model. |
> | Microsoft.CognitiveServices/accounts/OpenAI/fine-tunes/delete | Delete the adaptation of a model. |
> | Microsoft.CognitiveServices/accounts/OpenAI/fine-tunes/read | Gets information about fine-tuned models. |
> | Microsoft.CognitiveServices/accounts/OpenAI/gptv-registrations/read | Gets a registered Azure Resource corresponding to a deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/gptv-registrations/delete | Unregisters a registered Azure Resource corresponding to a deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/gptv-registrations/write | Registers or updates an existing Azure Resource corresponding to a deployment. |
> | Microsoft.CognitiveServices/accounts/OpenAI/images/generations/action | Create image generations. |
> | Microsoft.CognitiveServices/accounts/OpenAI/management/modelscaleset/deployment/read | Get Modelscale set deployment status and info. |
> | Microsoft.CognitiveServices/accounts/OpenAI/management/modelscaleset/deployment/write | Modify Modelscale set deployment status and info. |
> | Microsoft.CognitiveServices/accounts/OpenAI/models/read | Gets information about models |
> | Microsoft.CognitiveServices/accounts/OpenAI/openapi/read | Get OpenAI Info |
> | Microsoft.CognitiveServices/accounts/OpenAI/responses/write | Create a response. |
> | Microsoft.CognitiveServices/accounts/OpenAI/responses/read | Get responses. |
> | Microsoft.CognitiveServices/accounts/OpenAI/responses/delete | Delete responses. |
> | Microsoft.CognitiveServices/accounts/OpenAI/stored-completions/read | Query completions data using filters or Get single completion data using completion Id or Get traffic metadata for the given account |
> | Microsoft.CognitiveServices/accounts/OpenAI/uploads/write | Capabilities for uploading large files. Includes capabilities for cancelling an in progress upload. |
> | Microsoft.CognitiveServices/accounts/Personalizer/rank/action | A personalization rank request. |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/action | Submit a new evaluation. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/client/action | Get the client configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/applyfromevaluation/action | Apply Learning Settings and model from a pre-existing Offline Evaluation, making them the current online Learning Settings and model and replacing the previous ones. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/client/action | Get configuration settings used in distributed Personalizer deployments. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/delete | Delete the current policy. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/read | Get the policy configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/write | Update the policy configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/read | Get the Learning Settings currently used by the Personalizer service. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/delete | Resets the learning settings of the Personalizer service to default. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/policy/write | Update the Learning Settings that the Personalizer service will use to train models. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/service/read | Get the service configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/service/write | Update the service configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/service/read | Get the Personalizer service configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/configurations/service/write | Update the Personalizer service configuration. |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/delete | Delete the evaluation associated with the ID. |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/read | Get the evaluation associated with the ID. List all submitted evaluations.* |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/write | Submit a new Offline Evaluation job. |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/delete | Delete the Offline Evaluation associated with the Id. |
> | Microsoft.CognitiveServices/accounts/Personalizer/evaluations/read | Get the Offline Evaluation associated with the Id. List of all Offline Evaluations.* |
> | Microsoft.CognitiveServices/accounts/Personalizer/events/reward/action | Report reward to allocate to the top ranked action for the specified event. |
> | Microsoft.CognitiveServices/accounts/Personalizer/events/activate/action | Report that the specified event was actually displayed to the user and a reward should be expected for it. |
> | Microsoft.CognitiveServices/accounts/Personalizer/events/activate/action | Report that the specified event was actually used (e.g. by being displayed to the user) and a reward should be expected for it. |
> | Microsoft.CognitiveServices/accounts/Personalizer/events/reward/action | Report reward between 0 and 1 that resulted from using the action specified in rewardActionId, for the specified event. |
> | Microsoft.CognitiveServices/accounts/Personalizer/featureimportances/read | List of all Feature Importances. Get the Feature Importance associated with the Id. |
> | Microsoft.CognitiveServices/accounts/Personalizer/featureimportances/write | Submit a new Feature Importance job. |
> | Microsoft.CognitiveServices/accounts/Personalizer/featureimportances/delete | Delete the Feature Importance associated with the Id. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/delete | Deletes all the logs. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/delete | Delete all logs of Rank and Reward calls stored by Personalizer. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/interactions/action | The endpoint is intended to be used from within a SDK for logging interactions and accepts specific format defined in https://github.com/VowpalWabbit/reinforcement_learning. This endpoint should not be used by the customer. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/observations/action | The endpoint is intended to be used from within a SDK for logging observations and accepts specific format defined in https://github.com/VowpalWabbit/reinforcement_learning. This endpoint should not be used by the customer. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/properties/read | Gets logs properties. |
> | Microsoft.CognitiveServices/accounts/Personalizer/logs/properties/read | Get properties of the Personalizer logs. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/read | Get current model. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/delete | Resets the model. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/read | Get the model file generated by Personalizer service. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/delete | Resets the model file generated by Personalizer service. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/write | Replace the existing model file for the Personalizer service. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/properties/read | Get model properties. |
> | Microsoft.CognitiveServices/accounts/Personalizer/model/properties/read | Get properties of the model file generated by Personalizer service. |
> | Microsoft.CognitiveServices/accounts/Personalizer/multislot/rank/action | Submit a Personalizer multi-slot rank request. Receives a context, a list of actions, and a list of slots. Returns which of the provided actions should be used in each slot, in each rewardActionId. |
> | Microsoft.CognitiveServices/accounts/Personalizer/multislot/events/activate/action | Report that the specified event was actually used or displayed to the user and a rewards should be expected for it. |
> | Microsoft.CognitiveServices/accounts/Personalizer/multislot/events/reward/action | Report reward that resulted from using the action specified in rewardActionId for the slot. |
> | Microsoft.CognitiveServices/accounts/Personalizer/status/read | Gets the status of the operation. |
> | Microsoft.CognitiveServices/accounts/Personalizer/status/read | *NotDefined* |
> | Microsoft.CognitiveServices/accounts/QnAMaker/root/action | QnA Maker |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/root/action | QnA Maker |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/read | Download alterations from runtime. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/alterations/write | Replace alterations data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/read | Gets endpoint keys for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/read | Gets endpoint settings for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/endpointsettings/write | Update endpoint settings for an endpoint. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/publish/action | Publishes all changes in test index of a knowledgebase to its prod index. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/delete | Deletes the knowledgebase and all its data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/knowledgebases/download/read | Download the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/operations/read | Gets details of a specific long running operation. |
> | Microsoft.CognitiveServices/accounts/QnAMaker.v2/QnaMaker/generateanswer/action | GenerateAnswer call to query over the given passage or documents |
> | Microsoft.CognitiveServices/accounts/QnAMaker/alterations/read | Download alterations from runtime. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/alterations/write | Replace alterations data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | Microsoft.CognitiveServices/accounts/QnAMaker/endpointsettings/write | Update endpoint settings for an endpoint. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/publish/action | Publishes all changes in test index of a knowledgebase to its prod index. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/delete | Deletes the knowledgebase and all its data. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/knowledgebases/download/read | Download the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/QnAMaker/operations/read | Gets details of a specific long running operation. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/issuetoken/action | Issue Cognitive Services jwt token for authentication. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/models/action | This method can be used to copy a model from one location to another. If the target subscription |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/transcriptions/action | Transcribe audio |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/webhooks/action | Web hooks operations |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/datasets/write | Create or update a dataset |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/datasets/delete | Delete a dataset |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/datasets/read | Get one or more datasets |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/datasets/files/read | Get one or more dataset files |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/write | Create or update an endpoint |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/delete | Delete an endpoint |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/read | Get one or more endpoints |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/files/logs/write | Create a endpoint data export |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/files/logs/delete | Delete some or all custom model endpoint logs |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/endpoints/files/logs/read | Get one or more custom model endpoint logs |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/evaluations/write | Create or update an evaluation |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/evaluations/delete | Delete an evaluation |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/evaluations/read | Get one or more evaluations |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/evaluations/files/read | Get one or more evaluation files |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/healthstatus/read | Get health status |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/models/write | Create or update a model. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/models/delete | Delete a model |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/models/read | Get one or more models |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/models/files/read | Returns files for this model. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/projects/write | Create or update a project |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/projects/delete | Delete a project |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/projects/read | Get one or more projects |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/transcriptions/write | Create or update a transcription |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/transcriptions/delete | Delete a transcription |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/transcriptions/read | Get one or more transcriptions |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/transcriptions/files/read | Get one or more transcription files |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/webhooks/write | Create or update a web hook |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/webhooks/delete | Delete a web hook |
> | Microsoft.CognitiveServices/accounts/SpeechServices/speechrest/webhooks/read | Get one or more web hooks |
> | Microsoft.CognitiveServices/accounts/SpeechServices/synctranscriptions/write | create file based sync transcriptions |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles:verify/action | Verifies existing profiles against input audio. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/phrases/read | Retrieves list of supported passphrases for a specific locale. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/write | Create a new speaker profile with specified locale. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/delete | Deletes an existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/read | Retrieves a set of profiles or retrieves a single profile by ID. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/verify/action | Verifies existing profiles against input audio. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles:reset/write | Resets existing profile to its original creation state. The reset operation does the following: |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/enrollments/write | Adds an enrollment to existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/enrollments/write | Adds an enrollment to existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-dependent/profiles/reset/write | Resets existing profile to its original creation state. The reset operation does the following: |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles:identifysinglespeaker/action | Identifies who is speaking in input audio among a list of candidate profiles. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles:verify/action | Verifies existing profiles against input audio. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/phrases/read | Retrieves list of supported passphrases for a specific locale. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/write | Creates a new speaker profile with specified locale. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/delete | Deletes an existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/identifysinglespeaker/action | Identifies who is speaking in input audio among a list of candidate profiles. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/read | Retrieves a set of profiles or retrieves a single profile by ID. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/verify/action | Verifies existing profiles against input audio. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles:reset/write | Resets existing profile to its original creation state. The reset operation does the following: |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/enrollments/write | Adds an enrollment to existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/enrollments/write | Adds an enrollment to existing profile. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/text-independent/profiles/reset/write | Resets existing profile to its original creation state. The reset operation does the following: |
> | Microsoft.CognitiveServices/accounts/SpeechServices/unified-speech/frontend/action | This endpoint manages the Speech Frontend |
> | Microsoft.CognitiveServices/accounts/SpeechServices/unified-speech/management/action | This endpoint manages the Speech Frontend |
> | Microsoft.CognitiveServices/accounts/SpeechServices/unified-speech/probes/action | This endpoint monitors the Speech Frontend health |
> | Microsoft.CognitiveServices/accounts/SpeechServices/unified-speech/languages/action | This endpoint provides the REST language api. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/unified-speech/legacy/query/action | The Speech Service legacy REST api. |
> | Microsoft.CognitiveServices/accounts/SpeechServices/voiceagent/realtime/action | Create a realtime connection to the voice agent api |
> | Microsoft.CognitiveServices/accounts/SpellCheck/spellcheck/action | Get result of a spell check query through GET or POST. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/languages/action | The API returns the detected language and a numeric score between 0 and 1. Scores close to 1 indicate 100% certainty that the identified language is true. A total of 120 languages are supported. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/entities/action | The API returns a list of known entities and general named entities (\"Person\", \"Location\", \"Organization\" etc) in a given document. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/keyphrases/action | The API returns a list of strings denoting the key talking points in the input text. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/sentiment/action | The API returns a numeric score between 0 and 1.<br>Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment.<br>A score of 0.5 indicates the lack of sentiment (e.g.<br>a factoid statement). |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/analyze/action | Submit a collection of text documents for analysis. Specify one or more unique tasks to be executed. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/action | QnA Maker |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/generateanswer/action | GenerateAnswer call to query over the given passage or documents |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/alterations/read | Download alterations from runtime. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/alterations/write | Replace alterations data. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/endpointkeys/read | Gets endpoint keys for an endpoint |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/endpointkeys/refreshkeys/action | Re-generates an endpoint key. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/endpointsettings/read | Gets endpoint settings for an endpoint |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/endpointsettings/write | Update endpoint settings for an endpoint. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/publish/action | Publishes all changes in test index of a knowledgebase to its prod index. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/delete | Deletes the knowledgebase and all its data. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/read | Gets List of Knowledgebases or details of a specific knowledgebase. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/write | Asynchronous operation to modify a knowledgebase or Replace knowledgebase contents. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/generateanswer/action | GenerateAnswer call to query the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/train/action | Train call to add suggestions to the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/create/write | Asynchronous operation to create a new knowledgebase. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/knowledgebases/download/read | Download the knowledgebase. |
> | Microsoft.CognitiveServices/accounts/TextAnalytics/QnaMaker/operations/read | Gets details of a specific long running operation. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document:translate/action | API to translate a document. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/detect/action | Identifies the language of a piece of text. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/breaksentence/action | Identifies the positioning of sentence boundaries in a piece of text. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/translate/action | Translates text. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/transliterate/action | Converts text in one language from one script to another script. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/action | Creates a new model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/action | Creates a new workspace |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/categories/read | Gets the list of categories that can be assigned to the project. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/delete | Delete the document |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/read | Gets the documents or Gets the requested document |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/import/action | Upload files for processing. Documents are created asynchronously. Upload status can be checked using the returned job id |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/download/read | Downloads a zip containing Documents file(s) selected from project or all documents for model |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/export/read | Downloads a zip containing Documents file(s) selected from project or all documents for model (does not require method override on header) or Downloads a zip containing the file(s) belonging to this document |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/files/read | Gets the files for the document |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/files/content/read | Gets the content of the requested file |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/files/contents/read | Gets the content of the requested file |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/import/jobs/read | Gets the status of the document import |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/documents/import/jobs/all/read | Gets the status of all past document imports |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/internal/modelexport/containerexport/action | Generate SAS URL for exporting on-prem container based custom translator |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/languages/read | Gets the list of languages supported by Translator Studio |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/languages/supportedlanguagepairs/read | Gets the list of language pairs are supported by the text translator for translation. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/copy/action | Copy a model |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/delete | Deletes the model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/deployment/action | Deploy or undeploy a model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/read | Get the model details. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/train/action | Train a model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/write | Updates the model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/copyhistory/read | Gets the model copy history |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/tests/read | Gets the list of tests for the model. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/models/undeployhubmodel/delete | Accepts a request to undeploy a Hub model deployed to API V3. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/projects/write | Create a project or Updates the project. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/projects/delete | Delete the current project |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/projects/read | Gets the list of projects or Gets the project specified by Id. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/projects/models/read | Gets all the Models for the given project. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/regions/read | Gets the list of regions. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/subscriptions/write | Add a subscription key or Updates a subscription key |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/subscriptions/delete | Deletes a subscription key. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/subscriptions/read | Gets the translator text subscription for this workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/subscriptions/billingregions/read | Gets the translator text subscription regions. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/tests/export/action | Export the test results as a zip file. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/tests/read | Gets details of a specific test. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/tests/results/read | Gets aligned source, ref, general, and MT sentences. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/copyauthorization/action | Adds copy authorization to copy model from source workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/users/action | Adds users to the workspace. If the user already has permissions to the  workspace, this  will update their level of permissions to whatever is specified. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/delete | Deletes a workspace |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/read | Gets the information for a specific workspace or Gets the list of workspaces that the user has access to. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/write | Updates the workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/copyauthorization/read | Gets all copy authorization for the given workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/name/write | Changes the name of a workspace |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/pin/write | Pins this workspace as the default workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/users/read | Gets the list of users with access to a specific workspace |
> | Microsoft.CognitiveServices/accounts/TextTranslation/api/texttranslator/v1.0/workspaces/users/delete | Removes a users permissions to the workspace. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/batches/delete | Cancel a currently processing or queued document translation request. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/batches/read | Get the status of a specific document translation request based on its Id or get the status of all the document translation requests submitted |
> | Microsoft.CognitiveServices/accounts/TextTranslation/batches/write | Submit a bulk (batch) translation request to the Document Translation service. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/batches/documents/read | Get the translation status for a specific document based on the request Id and document Id or get the status for all documents in a document translation request. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/dictionary/examples/action | Provides examples that show how terms in the dictionary are used in context. This operation is used in tandem with Dictionary lookup. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/dictionary/lookup/action | Provides alternative translations for a word and a small number of idiomatic phrases.<br>Each translation has a part-of-speech and a list of back-translations.<br>The back-translations enable a user to understand the translation in context.<br>The Dictionary Example operation allows further drill down to see example uses of each translation pair. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document/batches/action | Use this API to submit a bulk (batch) translation request to the Document |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document/batches/delete | Cancel a currently processing or queued translation. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document/batches/read | Returns a list of batch requests submitted and the status for each Returns the status for a document translation request.* |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document/batches/documents/read | Returns the translation status for a specific document based on the request Id Returns the status for all documents in a batch document translation request.* |
> | Microsoft.CognitiveServices/accounts/TextTranslation/document/formats/read | The list of supported formats supported by the Document Translation |
> | Microsoft.CognitiveServices/accounts/TextTranslation/documents/formats/read | List document formats supported by the Document Translation service. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/glossaries/formats/read | List glossary formats supported by the Document Translation service. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/languages/read | Gets the set of languages currently supported by other operations of the Translator Text API. |
> | Microsoft.CognitiveServices/accounts/TextTranslation/storagesources/read | List storage sources/options supported by the Document Translation service. |
> | Microsoft.CognitiveServices/accounts/VideoSearch/trending/action | Get currently trending videos. |
> | Microsoft.CognitiveServices/accounts/VideoSearch/details/action | Get insights about a video, such as related videos. |
> | Microsoft.CognitiveServices/accounts/VideoSearch/search/action | Get videos relevant for a given query. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Consents/write | Create consent. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Consents/read | Read consent. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Consents/delete | Delete consent. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/DefaultConsentTemplates/read | Read default consent template. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Iterations/write | Create iteration. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Iterations/read | Read iteration. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/metadata/read | Query video translation metadata. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Operations/read | Read operation. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/TargetLocales/read | Read target locales. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/TargetLocales/write | Update target locale. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/TargetLocales/delete | Delete target locale. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Translations/write | Create translation. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Translations/read | Read translation. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/Translations/delete | Delete translation. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFiles/write | Create or update video files. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFiles/read | Read video files. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFiles/delete | Delete video files. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFileTranslations/write | Create video file translation. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFileTranslations/read | Read video file translations. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/VideoFileTranslations/delete | Delete video file translations. |
> | Microsoft.CognitiveServices/accounts/VideoTranslation/WebVttFiles/write | Create or update webvtt files. |
> | Microsoft.CognitiveServices/accounts/VisualSearch/search/action | Returns a list of tags relevant to the provided image |
> | Microsoft.CognitiveServices/accounts/WebSearch/search/action | Get web, image, news, & videos results for a given query. |

## Microsoft.HealthBot

Azure service: [Azure AI Health Bot](/azure/health-bot/overview)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HealthBot/healthBots/Action | Writes healthBots |
> | Microsoft.HealthBot/healthBots/Read | Read healthBots |
> | Microsoft.HealthBot/healthBots/Write | Writes healthBots |
> | Microsoft.HealthBot/healthBots/Delete | Deletes healthBots |
> | **DataAction** | **Description** |
> | Microsoft.HealthBot/healthBots/Reader/Action | Sign in to the management portal, with read-only access to resources, scenarios and configuration settings except for the bot instance keys & secrets and the end-user inputs. |
> | Microsoft.HealthBot/healthBots/Editor/Action | Sign in to the management portal, view and edit all the bot resources, scenarios and configuration settings except for the bot instance keys & secrets and the end-user inputs. Read-only access to the bot skills and channels. |
> | Microsoft.HealthBot/healthBots/Admin/Action | Sign in to the management portal, view and edit all of the bot resources, scenarios, configuration settings, instance keys & secrets. |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalAnchoring/Process/Action | Process health data in Clinical Anchoring Health Safeguard service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalCodesValidation/Process/Action | Process health data in Clinical Codes Validation Health Safeguards service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalConflictDetection/Process/Action | Process health data in Clinical Conflict Detection Health Safeguard service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalEvidenceVerification/Process/Action | Process health data in Clinical Evidence Verification Health Safeguards service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalProvenance/Process/Action | Process health data in Clinical Provenance Health Safeguard service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/ClinicalSemanticValidation/Process/Action | Process health data in Clinical Semantic Validation Health Safeguard service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/DetectHallucinationsAndOmissions/Process/Action | Process health data in Detect Hallucinations And Omissions Health Safeguard service API |
> | Microsoft.HealthBot/healthBots/HealthSafeguards/HealthAdaptedFiltering/Process/Action | Process health data in Health Adapted Filtering Health Safeguard service API |

## Microsoft.MachineLearningServices

Enterprise-grade machine learning service to build and deploy models faster.

Azure service: [Machine Learning](/azure/machine-learning/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MachineLearningServices/register/action | Registers the subscription for the Machine Learning Services Resource Provider |
> | Microsoft.MachineLearningServices/locations/deleteVirtualNetworkOrSubnets/action | Deleted the references to virtual networks/subnets associated with Machine Learning Service Workspaces. |
> | Microsoft.MachineLearningServices/locations/updateQuotas/action | Update quota for each VM family at a subscription or a workspace level. |
> | Microsoft.MachineLearningServices/locations/computeoperationsstatus/read | Gets the status of a particular compute operation |
> | Microsoft.MachineLearningServices/locations/mfeOperationResults/read | Gets the result of a particular MFE operation |
> | Microsoft.MachineLearningServices/locations/mfeOperationsStatus/read | Gets the status of a particular MFE operation |
> | Microsoft.MachineLearningServices/locations/quotas/read | Gets the currently assigned Workspace Quotas based on VMFamily. |
> | Microsoft.MachineLearningServices/locations/usages/read | Usage report for aml compute resources in a subscription |
> | Microsoft.MachineLearningServices/locations/vmsizes/read | Get supported vm sizes |
> | Microsoft.MachineLearningServices/locations/workspaceOperationsStatus/read | Gets the status of a particular workspace operation |
> | Microsoft.MachineLearningServices/operations/read | Get all the operations for the Machine Learning Services Resource Provider |
> | Microsoft.MachineLearningServices/registries/read | Gets the Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/write | Creates or updates the Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/delete | Deletes the Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/assets/read | Reads assets in Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/assets/write | Creates or updates assets in Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/assets/delete | Deletes assets in Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/assets/stage/write | Updates the stage on a Machine Learning Services registry asset |
> | Microsoft.MachineLearningServices/registries/checkNameAvailability/read | Checks name for Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/registries/connections/read | Gets the Machine Learning Services registry(ies) connection(s) |
> | Microsoft.MachineLearningServices/registries/connections/write | Creates or updates the Machine Learning Services registry(ies) connection(s) |
> | Microsoft.MachineLearningServices/registries/connections/delete | Deletes the Machine Learning Services registry(ies) registry(ies) connection(s) |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnectionProxies/read | View the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnectionProxies/write | Change the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnectionProxies/delete | Delete a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnectionProxies/validate/action | Validate a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateEndpointConnections/delete | Delete a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/registries/privateLinkResources/read | Gets the available private link resources for the specified instance of the Machine Learning Services registry(ies) |
> | Microsoft.MachineLearningServices/virtualclusters/read | Gets the Machine Learning Services Virtual Cluster(s) |
> | Microsoft.MachineLearningServices/virtualclusters/write | Creates or updates a Machine Learning Services Virtual Cluster(s) |
> | Microsoft.MachineLearningServices/virtualclusters/delete | Deletes the Machine Learning Services Virtual Cluster(s) |
> | Microsoft.MachineLearningServices/virtualclusters/jobs/submit/action | Submit job to a Machine Learning Services Virtual Cluster |
> | Microsoft.MachineLearningServices/workspaces/checkComputeNameAvailability/action | Checks name for compute in batch endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/read | Gets the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/resynckeys/action | Resync secrets for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/listStorageAccountKeys/action | List Storage Account keys for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/provisionManagedNetwork/action | Provision the managed network of Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/listConnectionModels/action | Lists the models in all Machine Learning Services connections |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionsApproval/action | Approve or reject a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/featuresets/action | Allows action on the Machine Learning Services FeatureSet(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestoreentities/action | Allows action on the Machine Learning Services FeatureEntity(s) |
> | Microsoft.MachineLearningServices/workspaces/assets/stage/write | Updates the stage on a Machine Learning Services workspace asset |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/read | Gets batch inference endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/write | Creates or updates batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/delete | Deletes batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/listKeys/action | Lists keys for batch inference endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/checkNameAvailability/read | Checks name for batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/read | Gets deployments in batch inference endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/write | Creates or updates deployments in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/delete | Deletes deployments in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/checkNameAvailability/read | Checks name for deployment in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/jobs/read | Reads job in batch inference deployment in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/jobs/write | Creates or updates job in batch inference deployment in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/deployments/jobs/delete | Deletes job in batch inference deployment in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/jobs/read | Reads job in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/jobs/write | Creates or updates job in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/batchEndpoints/jobs/delete | Deletes job in batch inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/read | Reads Code in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/write | Create or Update Code in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/delete | Deletes Code in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/versions/read | Reads Code Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/versions/write | Create or Update Code Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/codes/versions/delete | Deletes Code Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/read | Gets component in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/write | Creates or updates component in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/delete | Deletes component in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/versions/read | Gets component version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/versions/write | Creates or updates component version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/components/versions/delete | Deletes component version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/read | Gets the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/write | Creates or updates the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/delete | Deletes the compute resources in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/computes/listKeys/action | List secrets for compute resources in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/listNodes/action | List nodes for compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/start/action | Start compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/stop/action | Stop compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/restart/action | Restart compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/updateDataMounts/action | Update compute data mounts in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/updateIdleShutdownSetting/action | Update compute idle shutdown settings in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/applicationaccess/action | Access compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/updateSchedules/action | Edit compute start/stop schedules |
> | Microsoft.MachineLearningServices/workspaces/computes/applicationaccessuilinks/action | Enable compute instance UI links |
> | Microsoft.MachineLearningServices/workspaces/computes/reimage/action | Reimages compute resource in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/computes/enableSso/action | Enables SSO on compute instance in Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/connections/read | Gets the Machine Learning Services Workspace connection(s) |
> | Microsoft.MachineLearningServices/workspaces/connections/write | Creates or updates a Machine Learning Services connection(s) |
> | Microsoft.MachineLearningServices/workspaces/connections/delete | Deletes the Machine Learning Services connection(s) |
> | Microsoft.MachineLearningServices/workspaces/connections/listsecrets/action | Gets the Machine Learning Services connection with secret values |
> | Microsoft.MachineLearningServices/workspaces/connections/deployments/read | Gets the Machine Learning Services AzureOpenAI Connection deployment |
> | Microsoft.MachineLearningServices/workspaces/connections/deployments/write | Creates or Updates the Machine Learning Services AzureOpenAI Connection deployment |
> | Microsoft.MachineLearningServices/workspaces/connections/deployments/delete | Deletes the Machine Learning Services AzureOpenAI Connection deployment |
> | Microsoft.MachineLearningServices/workspaces/connections/models/read | Gets the Machine Learning Services AzureOpenAI Connection model |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/read | Read RAI Blocklists to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/write | Write RAI Blocklists to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/delete | Delete RAI Blocklists to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/addRaiBlocklistItems/action | Adds RAI blocklist items to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/deleteRaiBlocklistItems/action | Deletes RAI blocklist items to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/raiBlocklistItems/read | Read RAI Blocklist Items to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/raiBlocklistItems/write | Write RAI Blocklist Items to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiBlocklists/raiBlocklistItems/delete | Delete RAI Blocklist Items to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiPolicies/read | Read RAI Policies to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiPolicies/write | Write RAI Policies to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/connections/raiPolicies/delete | Delete RAI Policies to the Machine Learning Services connection |
> | Microsoft.MachineLearningServices/workspaces/data/read | Reads Data container in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/data/write | Writes Data container in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/data/delete | Deletes Data container in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/data/versions/read | Reads Data Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/data/versions/write | Create or Update Data Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/data/versions/delete | Deletes Data Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/read | Gets data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/write | Creates or updates data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/delete | Deletes data drift detectors in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/read | Gets dataset in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/write | Creates or updates dataset in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/delete | Deletes dataset in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/read | Gets registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/write | Creates or updates registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/delete | Deletes registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/preview/read | Gets dataset preview for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/read | Gets dataset profiles for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/write | Creates or updates dataset profiles for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/registered/schema/read | Gets dataset schema for registered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/read | Gets unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/write | Creates or updates unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/delete | Deletes unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/preview/read | Gets dataset preview for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/read | Gets dataset profiles for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/write | Creates or updates dataset profiles for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/schema/read | Gets dataset schema for unregistered datasets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/versions/read | Gets dataset version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/versions/write | Creates or updates dataset version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datasets/versions/delete | Deletes dataset version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/read | Gets datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/write | Creates or updates datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/delete | Deletes datastores in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/datastores/listsecrets/action | Lists datastore secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/diagnose/read | Diagnose setup problems of Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/endpoints/read | Gets the Machine Learning Services endpoint |
> | Microsoft.MachineLearningServices/workspaces/endpoints/write | Creates or Updates the Machine Learning Services endpoint |
> | Microsoft.MachineLearningServices/workspaces/endpoints/delete | Deletes the Machine Learning Services endpoint |
> | Microsoft.MachineLearningServices/workspaces/endpoints/listkeys/action | Lists keys for the Machine Learning Services endpoint |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/read | Gets the Machine Learning Services Endpoint deployment |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/write | Creates or Updates the Machine Learning Services Endpoint deployment |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/delete | Deletes the Machine Learning Services Endpoint deployment |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/modelmonitorings/read | Gets model monitor for specific deployment on an online enpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/modelmonitorings/write | Creates or updates model monitor detectors for specific deployment on an online enpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/deployments/modelmonitorings/delete | Deletes data model monitor for specific deployment on an online enpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/models/read | Gets the Machine Learning Services Endpoint model |
> | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/read | Gets published pipelines and pipeline endpoints  in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/write | Creates or updates published pipelines and pipeline endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/read | Gets environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/readSecrets/action | Gets environments with secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/write | Creates or updates environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/build/action | Builds environments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/versions/read | Gets environment version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/versions/write | Creates or updates environment versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/environments/versions/delete | Delete environment version in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/evaluations/write | Submits evaluation requests from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/evaluations/results/labels/read | Reads evaluation results' label from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/evaluations/results/reasonings/read | Reads evaluation results' reasoning from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/evaluations/results/states/read | Reads evaluation results' state from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/eventGridFilters/read | Get an Event Grid filter for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/eventGridFilters/write | Create or update an Event Grid filter for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/eventGridFilters/delete | Delete an Event Grid filter for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/experiments/read | Gets experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/write | Creates or updates experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/delete | Deletes experiments in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/submit/action | Creates or updates script runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/read | Gets runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/write | Creates or updates runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/experiments/runs/delete | Deletes runs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/features/read | Gets all enabled features for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/featuresets/read | Gets the Machine Learning Services FeatureSet(s) |
> | Microsoft.MachineLearningServices/workspaces/featuresets/write | Creates or Updates the Machine Learning Services FeatureSet(s) |
> | Microsoft.MachineLearningServices/workspaces/featuresets/delete | Delete the Machine Learning Services FeatureSet(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestoreentities/read | Gets the Machine Learning Services FeatureEntity(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestoreentities/write | Creates or Updates the Machine Learning Services FeatureEntity(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestoreentities/delete | Delete the Machine Learning Services FeatureEntity(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestores/read | Gets the Machine Learning Services FeatureStore(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestores/write | Creates or Updates the Machine Learning Services FeatureStore(s) |
> | Microsoft.MachineLearningServices/workspaces/featurestores/delete | Deletes the Machine Learning Services FeatureStore(s) |
> | Microsoft.MachineLearningServices/workspaces/hubs/read | Gets the Machine Learning Services Hub Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/hubs/write | Creates or updates a Machine Learning Services Hub Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/hubs/delete | Deletes the Machine Learning Services Hub Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/hubs/join/action | Join the Machine Learning Services Hub Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/hubs/policies/read | Gets the Machine Learning Services Hub policies |
> | Microsoft.MachineLearningServices/workspaces/hubs/policies/delete | Deletes the Machine Learning Services Hub policies |
> | Microsoft.MachineLearningServices/workspaces/hubs/policies/write | Creates or Updates the Machine Learning Services Hub policies |
> | Microsoft.MachineLearningServices/workspaces/jobs/read | Reads Jobs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/jobs/write | Create or Update Jobs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/jobs/delete | Deletes Jobs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/jobs/cancel/action | Cancel Jobs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/jobs/operationresults/read | Reads Jobs in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/export/action | Export labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labelimport/action | Import labels into labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/read | Gets labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/write | Creates labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/reject/action | Reject labels of labeling projects in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/delete | Deletes labels of labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/update/action | Updates labels of labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/labels/approve_unapprove/action | Approve or unapprove labels of labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/read | Gets labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/write | Creates or updates labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/delete | Deletes labeling project in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/labeling/projects/summary/read | Gets labeling project summary in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/linkedServices/read | Gets all linked services for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/linkedServices/write | Create or Update Machine Learning Services Workspace Linked Service(s) |
> | Microsoft.MachineLearningServices/workspaces/linkedServices/delete | Delete Machine Learning Services Workspace Linked Service(s) |
> | Microsoft.MachineLearningServices/workspaces/listNotebookAccessToken/read | List Azure Notebook Access Token for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/listNotebookKeys/read | List Azure Notebook keys for a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/managedstorages/claim/read | Get my claims on data |
> | Microsoft.MachineLearningServices/workspaces/managedstorages/claim/write | Update my claims on data |
> | Microsoft.MachineLearningServices/workspaces/managedstorages/claim/manage/action | Manage claims for all users in this workspace |
> | Microsoft.MachineLearningServices/workspaces/managedstorages/quota/read | Get my data quota usage |
> | Microsoft.MachineLearningServices/workspaces/managedstorages/quota/manage/action | Manage quota for all users in this workspace |
> | Microsoft.MachineLearningServices/workspaces/marketplaceSubscriptions/read | Gets the Machine Learning Service Workspaces Marketplace Subscription(s) |
> | Microsoft.MachineLearningServices/workspaces/marketplaceSubscriptions/write | Creates or Updates the Machine Learning Service Workspaces Marketplace Subscription(s) |
> | Microsoft.MachineLearningServices/workspaces/marketplaceSubscriptions/delete | Deletes the Machine Learning Service Workspaces Marketplace Subscription(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/listsecrets/action | List secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/read | Gets artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write | Creates or updates artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/delete | Deletes artifacts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/read | Gets secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/write | Creates or updates secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/secrets/delete | Deletes secrets in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/read | Gets snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/write | Creates or updates snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/delete | Deletes snapshots in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/metrics/resource/write | Creates resource metrics in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/read | Gets models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/write | Creates or updates models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/delete | Deletes models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/package/action | Packages models in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/versions/read | Reads Model Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/versions/write | Create or Update Model Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/models/versions/delete | Deletes Model Versions in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/modules/read | Gets modules in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/modules/write | Creates or updates module in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/notebooks/samples/read | Gets the sample notebooks |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/read | Gets the notebook files for a workspace |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/write | Writes files to the workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/delete | Deletes files from workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/upload/action | Upload files to workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/storage/download/action | Download files from workspace storage |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/read | Gets the Notebook VMs for a particular workspace |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/write | Change the state of a Notebook VM |
> | Microsoft.MachineLearningServices/workspaces/notebooks/vm/delete | Deletes a Notebook VM |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/read | Gets online inference endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/write | Creates or updates an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/delete | Deletes an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/regeneratekeys/action | Regenerate Keys action for Online Endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/score/action | Score Online Endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/token/action | Retrieve auth token to score Online Endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/listkeys/action | Retrieve auth keys to score Online Endpoints in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/checkNameAvailability/read | Checks name for an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments/read | Gets deployments in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/deployments/getlogs/action | Gets deployments Logs in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments/write | Creates or updates deployment in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments/delete | Deletes a deployment in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments/checkNameAvailability/read | Checks name for deployment in online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/deployments/operationresults/read | Gets deployments operation Result in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/deployments/operationsstatus/read | Gets deployments Operations Status in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineEndpoints/deployments/skus/read | Gets scale sku settings for a deployment in an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/operationresults/read | Checks Online Endpoint Operation Result for an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/onlineendpoints/operationsstatus/read | Checks Online Endpoint Operation Status for an online inference endpoint in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/outboundNetworkDependenciesEndpoints/read | Read all external outbound dependencies (FQDNs) programmatically |
> | Microsoft.MachineLearningServices/workspaces/outboundRules/read | Gets outbound rules in the Machine Learning Service Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/outboundRules/write | Creates or updates outbound rules in the Machine Learning Service Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/outboundRules/delete | Deletes outbound rules in the Machine Learning Service Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/read | Gets pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/write | Creates or updates pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/delete | Deletes pipeline drafts in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/read | View the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/write | Change the state of a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/delete | Delete a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnectionProxies/validate/action | Validate a connection proxy to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/read | View the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/write | Change the state of a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateEndpointConnections/delete | Delete a connection to a Private Endpoint resource of Microsoft.Network provider |
> | Microsoft.MachineLearningServices/workspaces/privateLinkResources/read | Gets the available private link resources for the specified instance of the Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.MachineLearningServices/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.MachineLearningServices/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Azure machine learning workspaces |
> | Microsoft.MachineLearningServices/workspaces/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Azure machine learning workspaces |
> | Microsoft.MachineLearningServices/workspaces/reports/read | Gets custom reports in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/reports/write | Creates or updates custom reports in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/reports/delete | Deletes custom reports in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/schedules/read | Gets schedule in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/schedules/write | Creates or updates schedule in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/schedules/delete | Deletes schedule in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/read | Gets the Machine Learning Service Workspaces Serverless Endpoint(s) |
> | Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/write | Creates or Updates the Machine Learning Service Workspaces Serverless Endpoint(s) |
> | Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/delete | Deletes the Machine Learning Service Workspaces Serverless Endpoint(s) |
> | Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/listKeys/action | Lists the keys for the Machine Learning Service Workspaces Serverless Endpoint(s) |
> | Microsoft.MachineLearningServices/workspaces/serverlessEndpoints/regenerateKeys/action | Regenerates the keys for the Machine Learning Service Workspaces Serverless Endpoint(s) |
> | Microsoft.MachineLearningServices/workspaces/services/read | Gets services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/write | Creates or updates ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/listkeys/action | Lists keys for ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aci/delete | Deletes ACI services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/write | Creates or updates AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/listkeys/action | Lists keys for AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/delete | Deletes AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/services/aks/score/action | Retrieve auth token or keys to score AKS services in Machine Learning Services Workspace(s) |
> | Microsoft.MachineLearningServices/workspaces/simulations/write | Submits simulation requests from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/simulations/results/images/read | Reads image simulation results from a Machine Learning Services Workspace |
> | Microsoft.MachineLearningServices/workspaces/simulations/results/texts/read | Reads text simulation results from a Machine Learning Services Workspace |

## Microsoft.Search

Leverage search services and get comprehensive results.

Azure service: [Azure AI Search](/azure/search/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Search/register/action | Registers the subscription for the search resource provider and enables the creation of search services. |
> | Microsoft.Search/checkNameAvailability/action | Checks availability of the service name. |
> | Microsoft.Search/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/write | Check if the configuration of the Network Security Perimeter needs updating. |
> | Microsoft.Search/operations/read | Lists all of the available operations of the Microsoft.Search provider. |
> | Microsoft.Search/searchServices/write | Creates or updates the search service. |
> | Microsoft.Search/searchServices/read | Reads the search service. |
> | Microsoft.Search/searchServices/delete | Deletes the search service. |
> | Microsoft.Search/searchServices/start/action | Starts the search service. |
> | Microsoft.Search/searchServices/stop/action | Stops the search service. |
> | Microsoft.Search/searchServices/listAdminKeys/action | Reads the admin keys. |
> | Microsoft.Search/searchServices/regenerateAdminKey/action | Regenerates the admin key. |
> | Microsoft.Search/searchServices/listQueryKeys/action | Returns the list of query API keys for the given Azure Search service. |
> | Microsoft.Search/searchServices/createQueryKey/action | Creates the query key. |
> | Microsoft.Search/searchServices/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.Search/searchServices/dataSources/read | Return a data source or a list of data sources. |
> | Microsoft.Search/searchServices/dataSources/write | Create a data source or modify its properties. |
> | Microsoft.Search/searchServices/dataSources/delete | Delete a data source. |
> | Microsoft.Search/searchServices/debugSessions/read | Return a debug session or a list of debug sessions. |
> | Microsoft.Search/searchServices/debugSessions/write | Create a debug session or modify its properties. |
> | Microsoft.Search/searchServices/debugSessions/delete | Delete a debug session. |
> | Microsoft.Search/searchServices/debugSessions/execute/action | Use a debug session, get execution data, or evaluate expressions on it. |
> | Microsoft.Search/searchServices/deleteQueryKey/delete | Deletes the query key. |
> | Microsoft.Search/searchServices/diagnosticSettings/read | Gets the diganostic setting read for the resource |
> | Microsoft.Search/searchServices/diagnosticSettings/write | Creates or updates the diganostic setting for the resource |
> | Microsoft.Search/searchServices/indexers/read | Return an indexer or its status, or return a list of indexers or their statuses. |
> | Microsoft.Search/searchServices/indexers/write | Create an indexer, modify its properties, or manage its execution. |
> | Microsoft.Search/searchServices/indexers/delete | Delete an indexer. |
> | Microsoft.Search/searchServices/indexes/read | Return an index or its statistics, return a list of indexes or their statistics, or test the lexical analysis components of an index. |
> | Microsoft.Search/searchServices/indexes/write | Create an index or modify its properties. |
> | Microsoft.Search/searchServices/indexes/delete | Delete an index. |
> | Microsoft.Search/searchServices/logDefinitions/read | Gets the available logs for the search service |
> | Microsoft.Search/searchServices/metricDefinitions/read | Gets the available metrics for the search service |
> | Microsoft.Search/searchServices/networkSecurityPerimeterAssociationProxies/delete | Delete an association proxy to a Network Security Perimeter resource of Microsoft.Network provider. |
> | Microsoft.Search/searchServices/networkSecurityPerimeterAssociationProxies/read | Delete an association proxy to a Network Security Perimeter resource of Microsoft.Network provider. |
> | Microsoft.Search/searchServices/networkSecurityPerimeterAssociationProxies/write | Change the state of an association to a Network Security Perimeter resource of Microsoft.Network provider |
> | Microsoft.Search/searchServices/networkSecurityPerimeterConfigurations/read | Read the Network Security Perimeter configuration. |
> | Microsoft.Search/searchServices/networkSecurityPerimeterConfigurations/reconcile/action | Reconcile the Network Security Perimeter configuration with NRP's (Microsoft.Network Resource Provider) copy. |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnections/write | Creates a private endpoint connections with the specified parameters or updates the properties or tags for the specified private endpoint connections |
> | Microsoft.Search/searchServices/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connections |
> | Microsoft.Search/searchServices/privateEndpointConnections/delete | Deletes an existing private endpoint connections |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/write | Creates a new shared private link resource with the specified parameters or updates the properties for the specified shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/read | Returns the list of shared private link resources or gets the properties for the specified shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/delete | Deletes an existing shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/operationStatuses/read | Get the details of a long running shared private link resource operation |
> | Microsoft.Search/searchServices/skillsets/read | Return a skillset or a list of skillsets. |
> | Microsoft.Search/searchServices/skillsets/write | Create a skillset or modify its properties. |
> | Microsoft.Search/searchServices/skillsets/delete | Delete a skillset. |
> | Microsoft.Search/searchServices/synonymMaps/read | Return a synonym map or a list of synonym maps. |
> | Microsoft.Search/searchServices/synonymMaps/write | Create a synonym map or modify its properties. |
> | Microsoft.Search/searchServices/synonymMaps/delete | Delete a synonym map. |
> | **DataAction** | **Description** |
> | Microsoft.Search/searchServices/indexes/documents/read | Read documents or suggested query terms from an index. |
> | Microsoft.Search/searchServices/indexes/documents/write | Upload documents to an index or modify existing documents. |
> | Microsoft.Search/searchServices/indexes/documents/delete | Delete documents from an index. |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)