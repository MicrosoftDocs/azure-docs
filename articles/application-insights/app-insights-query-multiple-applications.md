Sometimes you need to execute a query on all Application Insights resources. It can be useful when you are searching some data and not sure which application has it. Or you want to create a report on all your apps. This script shows all the sdk versions your applications are instrumented with. You can use it to make sure that SDKs are up to date.

You can run this script from your computer or from Azure CLI bash console.

1. First get the AAD token `az account get-access-token --query accessToken`. 
2. After that you take the list of Application Insights resources `az resource list --namespace microsoft.insights --resource-type components`. In this script, I only get apps from the current subscription. Previous post shows how to iterate over subscriptions.
3. For every resource script runs a query by querying `https://management.azure.com$ID/api/query/` with the access token from the first step.
4. Finally, script uses `python` to parse JSON and extract interesting information.

Here is a whole script:

``` bash
#!/bin/bash
ACCESS_TOKEN=$(az account get-access-token --query accessToken | sed -e 's/^"//' -e 's/"$//')
QUERY="requests | union pageViews | where timestamp>ago(1d)|summarize by sdkVersion"
JSON_PATH='["Tables"][0]["Rows"]'

az resource list --namespace microsoft.insights --resource-type components --query [*].[id] --out tsv \
  | while read ID; 
    do  
      HTTP_RESPONSE=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" --get \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        --data-urlencode "api-version=2014-12-01-preview" \
        --data-urlencode "query=$QUERY" \
        "https://management.azure.com$ID/api/query/")

      printf "$ID " 
      HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')
      HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

      if [ $HTTP_STATUS -eq 200  ]; then
        echo "$HTTP_BODY" | python -c "import json,sys;obj=json.load(sys.stdin);print(obj$JSON_PATH)"
      else
        echo "$HTTP_STATUS"
      fi
    done
```

You get the result like this:

```
#sergey@Azure:~$ ./runquery.sh
#/subscriptions/<GUID>/resourceGroups/RG1/providers/microsoft.insights/components/webteststools [['web:2.3.0-979']]
#/subscriptions/<GUID>/resourceGroups/RG2/providers/microsoft.insights/components/myapp [['a_web:2.3.0-1223']]
#/subscriptions/<GUID>/resourceGroups/RG3/providers/microsoft.insights/components/apmtips [['javascript:1.0.11']]
```
