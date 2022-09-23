---
title: Use REST API to populate data in Azure Cosmos DB Emulator
description: Learn how to send HTTP requests to the emulator. Using the emulator you can develop and test your application locally for free, without an Azure subscription.
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
author: ivarprudnikov
ms.author: iprudnikovas
ms.reviewer: iprudnikovas
ms.date: 09/22/2022
---

# Add test data to the emulator

## Provide a test key when starting the emulator

When we need to automate the startup and data bootstrapping, the key should be known in advance. 
You could pass the key as an environmental variable when starting the emulator.

```bash
MY_TEST_KEY="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

docker run -it --rm --name cosmosdb --detach -p 8081:8081 -p 10251-10254:10251-10254 --memory 3g --cpus=2.0 \
        -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=3 \
        -e AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=false \
        -e AZURE_COSMOS_EMULATOR_KEY=$MY_TEST_KEY \
        mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
```

### Wait for the emulator to start

Emulator takes some time to startup. In the case when you have it running in the background (e.g. using `--detach`) you could have a script that loops and checks for the API to become responsive:

```bash
echo "wait until the http starts responding"
until [ "$(curl -k -s -o /dev/null -w "%{http_code}" https://127.0.0.1:8081)" == "401" ]; do
    sleep 2;
done;
echo "emulated cosmosdb started"
```

## Create authorization token

REST API requires an authorization token to be present in the header. Due to the logic requiring multiple steps let's export it to a reusable function in the script.

**Prerequisites**

- `tr` - to lowercase the date
- `openssl` - to sign the expected structure containing the API operation with a master key
- `jq` - to encode the token as a URI 

```bash
create_cosmos_rest_token() {
    # HTTP-date
    # https://www.rfc-editor.org/rfc/rfc7231#section-7.1.1.1
    # e.g., `TZ=GMT date '+%a, %d %b %Y %T %Z'`
    ISSUE_DATE=$1
    ISSUE_DATE_LOWER=$(echo -n "$ISSUE_DATE" | tr '[:upper:]' '[:lower:]')
    # Base64 encoded key
    MASTER_KEY_BASE64=$2
    # Operation:
    # Database operations: dbs
    # Container operations: colls
    # Stored Procedures: sprocs
    # User Defined Functions: udfs
    # Triggers: triggers
    # Users: users
    # Permissions: permissions
    # Item level operations: docs
    RESOURCE_TYPE=${3:-dbs}
    # A link to the resource
    RESOURCE_LINK=$4
    # HTTP verb in lowercase, e.g. post, get
    VERB=$5
    # Read the bytes of a key
    KEY=$(echo -n "$MASTER_KEY_BASE64" | base64 -d)
    # Sign
    SIG=$(printf "%s\n%s\n%s\n%s\n\n" "$VERB" "$RESOURCE_TYPE" "$RESOURCE_LINK" "$ISSUE_DATE_LOWER" | openssl sha256 -hmac "$KEY" -binary | base64)
    # Encode and return
    printf %s "type=master&ver=1.0&sig=$SIG"|jq -sRr @uri
}
```

### Create a token for each operation

* A token to pass when creating a database

    ```bash
    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    CREATE_DB_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$MY_TEST_KEY" "dbs" "" "post" )
    ```
* A token to pass when creating a collection

    ```bash
    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    DATABASE_ID="foobar"
    CREATE_COLL_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$MY_TEST_KEY" "colls" "dbs/$DATABASE_ID" "post" )
    ```

## Add test data

Here are some examples that utilize the above function that generates the token.

### Create the database

```bash
DB_ID="foobar"
echo "Creating a database $DB_ID"
ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
CREATE_DB_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$MY_TEST_KEY" "dbs" "" "post" )
curl --data '{"id":"$DB_ID"}' \
    -H "Content-Type: application/json" \
    -H "x-ms-date: $ISSUE_DATE" \
    -H "Authorization: $CREATE_DB_TOKEN" \
    -H "x-ms-version: 2015-08-06" \
    https://127.0.0.1:8081/dbs
```

### Create a collection

```bash
DB_ID="foobar"
COLLECTION_ID="baz"
echo "Creating a collection $COLLECTION_ID in the database $DB_ID"
ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
CREATE_COLL_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$MY_TEST_KEY" "colls" "dbs/$DB_ID" "post" )
curl --data '{"id":"$COLLECTION_ID", "partitionKey":{"paths":["/id"], "kind":"Hash", "Version":2}}' \
    -H "Content-Type: application/json" \
    -H "x-ms-date: $ISSUE_DATE" \
    -H "Authorization: $CREATE_COLL_TOKEN" \
    -H "x-ms-version: 2015-08-06" \
    "https://127.0.0.1:8081/dbs/$DB_ID/colls"
```

## Next steps

In this article, you've learned how to generate an authorization token and use it in subsequent API requests to your emulated Cosmos DB instance. 
You can now proceed to the next articles:

- [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
- [Debug issues with the emulator](troubleshoot-local-emulator.md)
