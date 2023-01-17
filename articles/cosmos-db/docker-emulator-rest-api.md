---
title: REST API with Docker container emulator
titleSuffix: Azure Cosmos DB
description: Learn how to send secure requests to the REST API of the Azure Cosmos DB emulator running in a Docker container.
author: stefarroyo
ms.author: esarroyo
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.topic: how-to
ms.date: 11/21/2022
---

# Use the REST API with the Azure Cosmos DB emulator Docker container

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

You may find yourself in a situation where you need to start the emulator from the command line, create resources, and populate data without any UI intervention. For example, you may start the emulator as part of an automated test suite in a DevOps platform. The REST API for Azure Cosmos DB is available in the emulator to use for many of these requests. This guide will walk you through the steps necessary to interact with the REST API in the emulator.

## Provide a test key when starting the emulator

When you need to automate startup and data bootstrapping, the key you'll use should be known in advance. You can pass the key as an environmental variable when starting the emulator.

Consider this sample key that is stored as an environmental variable.

```bash
EMULATOR_KEY="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
```

> [!IMPORTANT]
> It is strongly recommended you generate your own key using a tool like `ssh-keygen` instead of using the sample key in this article.

Set the key when starting the emulator to the stored sample key. In this example command, other [sensible defaults](linux-emulator.md#run-the-linux-emulator-on-linux-os) are also used.

```bash
docker run \
    -it --rm \
    --name cosmosdb \
    --detach -p 8081:8081 -p 10251-10254:10251-10254 \
    --memory 3g --cpus=2.0 \
    -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=3 \
    -e AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=false \
    -e AZURE_COSMOS_EMULATOR_KEY=$EMULATOR_KEY \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
```

## Wait for the emulator to start

The emulator will take some time to start up. In the case where you have it running in the background using `--detach`, you can create a script to loop and check to see when the REST API is available:

```bash
echo "Wait until the emulator REST API responds"

until [ "$(curl -k -s -o /dev/null -w "%{http_code}" https://127.0.0.1:8081)" == "401" ]; do
    sleep 2;
done;

echo "Emulator REST API ready"
```

## Create authorization token

The REST API for the emulator requires an authorization token to be present in the header. Due to this logic requiring multiple steps, it's easier to export the creation of the token to a reusable function in the script.

First, let's review a list of prerequisite commands and packages you'll need to create this function.

- `tr` - to lowercase the date
- `openssl` - to sign the expected structure containing the API operation with a key
- `jq` - to encode the token as a URI

Now, let's create a function named `create_cosmos_rest_token` that will build an authorization token. This code sample includes comments to explain each step.

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

Let's look at examples where we can create tokens for common operations.

- First, creating a token to use when creating a new database

    ```bash
    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    CREATE_DB_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$EMULATOR_KEY" "dbs" "" "post" )
    ```

- Next, creating a token to pass to the API for container creation

    ```bash
    DATABASE_ID="<database-name>"
    
    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    CREATE_COLL_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$EMULATOR_KEY" "colls" "dbs/$DATABASE_ID" "post" )
    ```

## Add test data

Here are some examples that utilize the above function that generates the token.

- **Create a database**

    ```bash
    DB_ID="<database-name>"
    echo "Creating a database $DB_ID"
    
    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    CREATE_DB_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$EMULATOR_KEY" "dbs" "" "post" )
    
    curl --data '{"id":"$DB_ID"}' \
        -H "Content-Type: application/json" \
        -H "x-ms-date: $ISSUE_DATE" \
        -H "Authorization: $CREATE_DB_TOKEN" \
        -H "x-ms-version: 2015-08-06" \
        https://127.0.0.1:8081/dbs
    ```

- **Create a container**

    ```bash
    DB_ID="<database-name>"
    CONTAINER_ID="baz"
    echo "Creating a container $CONTAINER_ID in the database $DB_ID"

    ISSUE_DATE=$(TZ=GMT date '+%a, %d %b %Y %T %Z')
    CREATE_CT_TOKEN=$( create_cosmos_rest_token "$ISSUE_DATE" "$EMULATOR_KEY" "colls" "dbs/$DB_ID" "post" )
    
    curl --data '{"id":"$CONTAINER_ID", "partitionKey":{"paths":["/id"], "kind":"Hash", "Version":2}}' \
        -H "Content-Type: application/json" \
        -H "x-ms-date: $ISSUE_DATE" \
        -H "Authorization: $CREATE_CT_TOKEN" \
        -H "x-ms-version: 2015-08-06" \
        "https://127.0.0.1:8081/dbs/$DB_ID/colls"
    ```

## Next steps

In this article, you've learned how to generate an authorization token and use it in subsequent API requests to your emulated Cosmos DB instance.

To learn more about the linux emulator, check out these articles:

- [Run the emulator on Docker for Linux](linux-emulator.md)
- [Use the emulator on Docker for Windows](local-emulator-on-docker-windows.md)
