


# Face data structures

Face Identify API need a container data structure which holds face recognition data to work with. Face API involved three versions of such data structure. This document explains the details of them. Overall, we recommend user always use the latest one.

## Person Group

**Person Group** is the first container data structure to support identify operation. Several features to call out:

- A recognition model needs to be specified at person group creation time. All faces added to the person group will use the model to process. This model must match the model version with Face Id from detect API.
- Train API need to be called to make any data update reflect to identify API result. Which includes add/remove faces, add/remove persons.
- For free tier subscription, it can have up to 1000 entities. For S0 paid subscription, it can have up to 10,000 entities.

**Person Group Person** : represents a person to be identified. It can hold up to 248 faces.

## Large Person Group

**Large Person Group** is the second data structure introduced to support up to 1 million entities for S0 tier subscription. It has been optimized to support large scale data. It shares most of person group features: Train API need to be called before use, recognition model needed at creation time.

## Person Directory

**Person Directory** is a newer data structure to support identify operation with large scale, and higher accuracy. Person directory Each face API resource has a default Person directory data structure. It is a flat list of Person Directory Person object. A person directory can hold up to 75 million entities.

**Person Directory Person** : it represents a person to be identified. An update from Large Person Group and Person Group is that Person Directory Person allowing persistent face from different recognition model added to same person. However, Identify API will only match persistent face with same recognition model as the Face Id from detect API.

**Dynamic Person Group** : works directly with identify API to match detected face. It is a lightweight data structure allowing dynamically reference of person group person. Compared to large person group, it doesn't require Train operation, once the update operation is finished, it is available to be used in identify call.

**In-place person Id list** : Moreover, Identify API supports an in-place person Id list up to 30 IDs, which make it easier to specify a dynamic group.

**Examples** : identify against large amount candidates will yield lower accuracy and performance. Applications could use other information to scope down the candidate list to improve accuracy, here are several examples:

- In an access control system, person directory represents all employees of a company, dynamic person group represents employees having access to a single floor.
- In a flight on-boarding system, person directory represents all passengers of the airline company, dynamic person group represents passengers for a flight. In-place person Id list could represent the passengers who made last minute change.

For more details, please refer to "how to use person directory."
