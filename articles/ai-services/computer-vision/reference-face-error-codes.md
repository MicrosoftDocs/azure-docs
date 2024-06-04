---
title: Azure AI Face API error codes
description: Error codes returned from Face API services.
author: shaoli
ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: reference
ms.author: shaoli
ms.date: 05/24/2024
---

# Azure AI Face API error codes


## Common error codes

These error codes can be returned by any Face API calls.

|Http status code|Error code|Error message|Description|
|----------------|----------|-------------|-----------|
|Bad Request (400)|BadArgument|Request body is invalid.||
|Bad Request (400)|BadArgument|JSON parsing error.|Bad or unrecognizable request JSON body.|
|Bad Request (400)|BadArgument|'recognitionModel' is invalid.||
|Bad Request (400)|BadArgument|'detectionModel' is invalid.||
|Bad Request (400)|BadArgument|'name' is empty.||
|Bad Request (400)|BadArgument|'name' is too long.||
|Bad Request (400)|BadArgument|'userData' is too long.||
|Bad Request (400)|BadArgument|'start' is too long.||
|Bad Request (400)|BadArgument|'top' is invalid.||
|Bad Request (400)|BadArgument|Argument targetFace out of range.||
|Bad Request (400)|BadArgument|Invalid argument targetFace.|Caused by invalid string format or invalid left/top/height/width value.|
|Bad Request (400)|InvalidURL|Invalid image URL.|Supported formats include JPEG, PNG, GIF(the first frame) and BMP.|
|Bad Request (400)|InvalidURL|Invalid image URL or error downloading from target server. Remote server error returned: "An error occurred while sending the request."||
|Bad Request (400)|InvalidImage|Decoding error, image format unsupported.||
|Bad Request (400)|InvalidImage|No face detected in the image.||
|Bad Request (400)|InvalidImage|There is more than 1 face in the image.||
|Bad Request (400)|InvalidImageSize|Image size is too small.|The valid image file size should be larger than or equal to 1 KB.|
|Bad Request (400)|InvalidImageSize|Image size is too big.|The valid image file size should be no larger than 6 MB.|
|Unauthorized (401)|401|Access denied due to invalid subscription key or wrong API endpoint. Make sure to provide a valid key for an active subscription and use a correct regional API endpoint for your resource.||
|Conflict (409)|ConcurrentOperationConflict|There is a conflict operation on resource `<resourceName>`, please try later.||
|Too Many Requests (429)|429|Rate limit is exceeded.||


## Face Detection error codes

These error codes can be returned by Face Detection operation.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Invalid argument returnFaceAttributes.||
|Bad Request (400)|BadArgument|'returnFaceAttributes' is not supported by detection_02.||
|Bad Request (400)|BadArgument|'returnLandmarks' is not supported by detection_02.||

## Face Liveness Session error codes

These error codes can be returned by Face Liveness Session operations.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Start parameter is invalid. Please specify the 'Id' field of the last entry to continue the listing process.||
|Bad Request (400)|BadArgument|Top parameter is invalid. Valid range is between 1 and 1000 inclusive.||
|Bad Request (400)|InvalidRequestBody|Incorrect request body provided. Please check the operation schema and try again.||
|Bad Request (400)|InvalidTokenLifetime|Invalid authTokenTimeToLiveInSeconds specified. Must be within 60 to 86400.||
|Bad Request (400)|InvalidLivenessOperationMode|Invalid livenessOperationMode specified. Must be 'Passive'.||
|Bad Request (400)|InvalidDeviceCorrelationId|A device correlation ID is required in the request body during session create or session start. Must not be null or empty, and be no more than 64 characters.||
|Not Found (404)|SessionNotFound|Session ID is not found. The session ID is expired or does not exist.||

## Face Identify error codes

These error codes can be returned by Face Identify operation.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|'recognitionModel' is incompatible.||
|Bad Request (400)|BadArgument|Person group ID is invalid.||
|Bad Request (400)|BadArgument|Large person group ID is invalid.||
|Bad Request (400)|BadArgument|Dynamic person group ID is invalid.||
|Bad Request (400)|BadArgument|The argument maxNumOfCandidatesReturned is not valid.|The valid range is between [1, 100].|
|Bad Request (400)|BadArgument|The argument confidenceThreshold is not valid.|The valid range is between [0, 1].|
|Bad Request (400)|BadArgument|The length of faceIds is not in a valid range.|The valid range is between [1, 10].|
|Bad Request (400)|FaceNotFound|Face is not found.||
|Bad Request (400)|PersonGroupNotFound|Person group is not found.||
|Bad Request (400)|LargePersonGroupNotFound|Large person group is not found.||
|Bad Request (400)|DynamicPersonGroupNotFound|Dynamic person group is not found.||
|Bad Request (400)|PersonGroupNotTrained|Person group not trained.||
|Bad Request (400)|LargePersonGroupNotTrained|Large person group not trained.||
|Bad Request (400)|PersonGroupIdAndLargePersonGroupIdBothNotNull|Large person group ID and person group ID are both not null.||
|Bad Request (400)|PersonGroupIdAndLargePersonGroupIdBothNull|Large person group ID and person group ID are both null.||
|Bad Request (400)|MissingIdentificationScopeParameters|No identification scope parameter is present in the request.||
|Bad Request (400)|IncompatibleIdentificationScopeParametersCombination|Incompatible identification scope parameters are present in the request.||
|Conflict (409)|PersonGroupTrainingNotFinished|Person group is under training.||
|Conflict (409)|LargePersonGroupTrainingNotFinished|Large person group is under training.||

## Face Verify error codes

These error codes can be returned by Face Verify operation.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|'recognitionModel' is incompatible.||
|Bad Request (400)|BadArgument|Face ID is invalid.|A valid faceId comes from Face - Detect.|
|Bad Request (400)|BadArgument|Person ID is invalid.|A valid personId is generated from Create Person Group Person, Create Large Person Group Person or Person Directory - Create Person.|
|Bad Request (400)|BadArgument|Person group ID is invalid.||
|Bad Request (400)|BadArgument|Large person group ID is invalid.||
|Bad Request (400)|PersonNotFound|Person is not found.||
|Bad Request (400)|PersonGroupNotFound|Person Group is not found.||
|Bad Request (400)|LargePersonGroupNotFound|Large Person Group is not found.||
|Not Found (404)|FaceNotFound|Face is not found.||
|Not Found (404)|PersonNotFound|Person is not found.||
|Not Found (404)|PersistedFaceNotFound|No persisted face of the person is found.||

## Find Similar error codes

These error codes can be returned by Face Find Similar operation.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|'recognitionModel' is incompatible.||
|Bad Request (400)|BadArgument|Mode is invalid.||
|Bad Request (400)|BadArgument|Face list ID is invalid.||
|Bad Request (400)|BadArgument|Large face list ID is invalid.||
|Bad Request (400)|BadArgument|LargeFaceListId, faceListId and faceIds, not exactly one of them is valid.||
|Bad Request (400)|BadArgument|LargeFaceListId, faceListId and faceIds are all null.||
|Bad Request (400)|BadArgument|2 or more of largeFaceListId, faceListId and faceIds are not null.||
|Bad Request (400)|BadArgument|The argument maxNumOfCandidatesReturned is not valid.|The valid range is between [1, 1000].|
|Bad Request (400)|BadArgument|The length of faceIds is not in a valid range.|The valid range is between [1, 1000].|
|Bad Request (400)|FaceNotFound|Face is not found.||
|Bad Request (400)|FaceListNotFound|Face list is not found.||
|Bad Request (400)|LargeFaceListNotFound|Large face list is not found.||
|Bad Request (400)|LargeFaceListNotTrained|Large face list is not trained.||
|Bad Request (400)|FaceListNotReady|Face list is empty.||
|Conflict (409)|LargeFaceListTrainingNotFinished|Large face list is under training.||

## Face Group error codes

These error codes can be returned by Face Group operation.

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|'recognitionModel' is incompatible.||
|Bad Request (400)|BadArgument|The length of faceIds is not in a valid range.|The valid range is between [2, 1000].|


## Person Group operations

These error codes can be returned by Person Group operations.

### Person Group error codes

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Person group ID is invalid.|Valid character is English letter in lower case, digit, '-' or '_'. Maximum length is 64.|
|Forbidden (403)|QuotaExceeded|Person group number reached subscription level limit.||
|Forbidden (403)|QuotaExceeded|Person number reached person group level limit.||
|Forbidden (403)|QuotaExceeded|Person number reached subscription level limit.||
|Forbidden (403)|QuotaExceeded|Persisted face number reached limit.||
|Not Found (404)|PersonGroupNotFound|Person group is not found.||
|Not Found (404)|PersonGroupNotFound|Person group ID is invalid.||
|Not Found (404)|PersonNotFound|Person `<personId>` is not found.||
|Not Found (404)|PersonNotFound|Person ID is invalid.||
|Not Found (404)|PersistedFaceNotFound|Persisted face is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face `<faceId>` is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face ID is invalid.||
|Not Found (404)|PersonGroupNotTrained|Person group not trained.|This error appears on getting training status of a group which never been trained.|
|Conflict (409)|PersonGroupExists|Person group already exists.||
|Conflict (409)|PersonGroupTrainingNotFinished|Person group is under training.|Try again after training completed.|

### Large Person Group error codes

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Large person group ID is invalid.|Valid character is English letter in lower case, digit, '-' or '_'. Maximum length is 64.|
|Bad Request (400)|BadArgument|Both 'name' and 'userData' are empty.||
|Forbidden (403)|QuotaExceeded|Large person group number reached subscription level limit.||
|Forbidden (403)|QuotaExceeded|Person number reached large person group level limit.||
|Forbidden (403)|QuotaExceeded|Person number reached subscription level limit.||
|Forbidden (403)|QuotaExceeded|Persisted face number reached limit.||
|Not Found (404)|LargePersonGroupNotFound|Large person group is not found.||
|Not Found (404)|LargePersonGroupNotFound|Large person group ID is invalid.||
|Not Found (404)|PersonNotFound|Person `<personId>` is not found.||
|Not Found (404)|PersonNotFound|Person ID is invalid.||
|Not Found (404)|PersistedFaceNotFound|Persisted face is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face `<faceId>` is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face ID is invalid.||
|Not Found (404)|LargePersonGroupNotTrained|Large person group not trained.|This error appears on getting training status of a group which never been trained.|
|Conflict (409)|LargePersonGroupExists|Large person group already exists.||
|Conflict (409)|LargePersonGroupTrainingNotFinished|Large person group is under training.|Try again after training completed.|

## Face List operations

These error codes can be returned by Face List operations.

### Face List error codes

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Face list ID is invalid.|Valid character is English letter in lower case, digit, '-' or '_'. Maximum length is 64.|
|Forbidden (403)|QuotaExceeded|Persisted face number reached limit.||
|Not Found (404)|FaceListNotFound|Face list is not found.||
|Not Found (404)|FaceListNotFound|Face list ID is invalid.||
|Not Found (404)|PersistedFaceNotFound|Persisted face is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face ID is invalid.||
|Conflict (409)|FaceListExists|Face list already exists.||

### Large Face List error codes

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Large face list ID is invalid.|Valid character is English letter in lower case, digit, '-' or '_'. Maximum length is 64.|
|Bad Request (400)|BadArgument|Both 'name' and 'userData' are empty.||
|Forbidden (403)|QuotaExceeded|Large Face List number reached limit.||
|Forbidden (403)|QuotaExceeded|Persisted face number reached limit.||
|Not Found (404)|LargeFaceListNotFound|Large face list is not found.||
|Not Found (404)|LargeFaceListNotFound|Large face list ID is invalid.||
|Not Found (404)|PersistedFaceNotFound|Large Face List Face `<faceId>` is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face ID is invalid.||
|Not Found (404)|LargeFaceListNotTrained|Large face list not trained.|This error appears on getting training status of a large face list which never been trained.|
|Conflict (409)|LargeFaceListExists|Large face list already exists.||
|Conflict (409)|LargeFaceListTrainingNotFinished|Large face list is under training.|Try again after training completed.|

## Person Directory operations

These error codes can be returned by Person Directory operations.

### Person Directory error codes

|Http status code|Error code|Error message|Description|
|---|---|---|---|
|Bad Request (400)|BadArgument|Recognition model is not supported for this feature.||
|Bad Request (400)|BadArgument|'start' is not valid person ID.||
|Bad Request (400)|BadArgument|Both 'name' and 'userData' are empty.||
|Bad Request (400)|DynamicPersonGroupNotFound|Dynamic person group ID is invalid.||
|Forbidden (403)|QuotaExceeded|Person number reached subscription level limit.||
|Forbidden (403)|QuotaExceeded|Persisted face number reached limit.||
|Not Found (404)|DynamicPersonGroupNotFound|Dynamic person group was not found.||
|Not Found (404)|DynamicPersonGroupNotFound|DynamicPersonGroupPersonReference `<groupId>` is not found.||
|Not Found (404)|PersonNotFound|Person is not found.||
|Not Found (404)|PersonNotFound|Person ID is invalid.||
|Not Found (404)|PersistedFaceNotFound|Persisted face is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted face `<faceId>` is not found.||
|Not Found (404)|PersistedFaceNotFound|Persisted Face ID is invalid.||
|Conflict (409)|DynamicPersonGroupExists|Dynamic person group ID `<groupId>` already exists.||

Next steps

- [Face API reference](/rest/api/face/operation-groups)