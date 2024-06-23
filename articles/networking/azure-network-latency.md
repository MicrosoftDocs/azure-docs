---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: virtual-network
ms.topic: article
ms.date: 06/20/2024
ms.author: mbender
ms.custom: references_regions,updatedFY24S2
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *June 20th, 2024*, and it covers the 30-day period ending on *June 19th, 2024*.

For readability, each table is split into tabs for groups of Azure regions. The tabs are organized by regions, and then by source region in the first column of each table. For example, the *East US* tab also shows the latency from all source regions to the two *East US* regions: *East US* and *East US 2*. 

> [!IMPORTANT]
> Monthly latency numbers across Azure regions do not change on a regular basis. You can expect an update of these tables every 6 to 9 months. Not all public Azure regions are listed in the following tables. When new regions come online, we will update this document as soon as latency data is available.
> 
> You can perform VM-to-VM latency between regions using [test Virtual Machines](../virtual-network/virtual-network-test-latency.md) in your Azure subscription.

#### [North America / South America](#tab/Americas)

Latency tables for Americas regions including US, Canada, and Brazil.

Use the following tabs to view latency statistics for each region.

#### [Europe](#tab/Europe)

Latency tables for European regions.

Use the following tabs to view latency statistics for each region.

#### [Australia / Asia / Pacific](#tab/APAC)

Latency tables for Australia, Asia, and Pacific regions including and Australia, Japan, Korea, and India.

Use the following tabs to view latency statistics for each region.

#### [Middle East / Africa](#tab/MiddleEast)

Latency tables for Middle East / Africa regions including UAE, South Africa, Israel, and Qatar.

Use the following tabs to view latency statistics for each region.

---

#### [West US](#tab/WestUS/Americas)

| Source              | West US | West US 2 |
|---------------------|---------|-----------|
| Australia Central   | 148     | 168       |
| Australia Central 2 | 148     | 167       |
| Australia East      | 140     | 161       |
| Australia Southeast | 153     | 174       |
| Brazil South        | 186     | 183       |
| Canada Central      | 61      | 60        |
| Canada East         | 71      | 69        |
| Central India       | 220     | 212       |
| Central US          | 41      | 39        |
| East Asia           | 151     | 143       |
| East US             | 71      | 66        |
| East US 2           | 69      | 70        |
| France Central      | 150     | 150       |
| France South        | 153     | 148       |
| Germany North       | 165     | 164       |
| Germany West Central| 160     | 157       |
| Israel Central      | 194     | 190       |
| Italy North         | 165     | 162       |
| Japan East          | 108     | 100       |
| Japan West          | 115     | 107       |
| Korea Central       | 160     | 124       |
| Korea South         | 132     | 124       |
| North Central US    | 51      | 49        |
| North Europe        | 156     | 152       |
| Norway East         | 172     | 171       |
| Norway West         | 167     | 167       |
| Poland North        | 175     | 177       |
| Qatar Central       | 264     | 254       |
| South Africa North  | 294     | 291       |
| South Africa West   | 278     | 275       |
| South Central US    | 36      | 48        |
| South India         | 203     | 196       |
| Southeast Asia      | 171     | 163       |
| Sweden Central      | 183     | 182       |
| Switzerland North   | 167     | 164       |
| Switzerland West    | 160     | 159       |
| UAE Central         | 252     | 249       |
| UAE North           | 255     | 251       |
| UK South            | 148     | 146       |
| UK West             | 153     | 149       |
| West Central US     | 27      | 25        |
| West Europe         | 154     | 154       |
| West US             | 24      |           |
| West US 2           | 25      |           |
| West US 3           | 19      | 39        |



#### [Central US](#tab/CentralUS/Americas)

| Source              | Central US | North Central US | South Central US | West Central US |
|---------------------|------------|------------------|------------------|-----------------|
| Australia Central   | 177        | 190              | 166              | 164             |
| Australia Central 2 | 177        | 190              | 166              | 164             |
| Australia East      | 174        | 184              | 162              | 160             |
| Australia Southeast | 185        | 195              | 173              | 171             |
| Brazil South        | 149        | 137              | 142              | 163             |
| Canada Central      | 24         | 17               | 47               | 38              |
| Canada East         | 33         | 26               | 57               | 48              |
| Central India       | 231        | 224              | 230              | 240             |
| Central US          |            | 14               | 27               | 18              |
| East Asia           | 180        | 191              | 171              | 167             |
| East US             | 31         | 21               | 35               | 45              |
| East US 2           | 35         | 26               | 34               | 50              |
| France Central      | 116        | 107              | 112              | 131             |
| France South        | 116        | 102              | 116              | 130             |
| Germany North       | 130        | 121              | 128              | 145             |
| Germany West Central| 123        | 114              | 122              | 138             |
| Israel Central      | 156        | 144              | 155              | 171             |
| Italy North         | 127        | 115              | 126              | 141             |
| Japan East          | 137        | 148              | 128              | 123             |
| Japan West          | 144        | 155              | 134              | 130             |
| Korea Central       | 197        | 218              | 166              | 179             |
| Korea South         | 160        | 174              | 152              | 149             |
| North Central US    | 14         |                  | 37               | 28              |
| North Europe        | 112        | 104              | 122              | 132             |
| Norway East         | 136        | 127              | 136              | 150             |
| Norway West         | 129        | 118              | 133              | 145             |
| Poland North        | 141        | 129              | 141              | 155             |
| Qatar Central       | 226        | 214              | 224              | 240             |
| South Africa North  | 257        | 245              | 255              | 271             |
| South Africa West   | 241        | 228              | 239              | 255             |
| South Central US    | 27         | 36               |                  | 26              |
| South India         | 232        | 247              | 230              | 223             |
| Southeast Asia      | 200        | 212              | 203              | 190             |
| Sweden Central      | 142        | 132              | 142              | 162             |
| Switzerland North   | 129        | 117              | 127              | 143             |
| Switzerland West    | 123        | 111              | 125              | 138             |
| UAE Central         | 214        | 202              | 213              | 229             |
| UAE North           | 217        | 205              | 215              | 231             |
| UK South            | 104        | 94               | 114              | 124             |
| UK West             | 105        | 97               | 117              | 127             |
| West Central US     | 17         | 27               | 25               |                 |
| West Europe         | 119        | 109              | 119              | 132             |
| West US             | 41         | 50               | 36               | 27              |
| West US 2           | 39         | 49               | 50               | 26              |
| West US 3           | 45         | 53               | 22               | 34              |


#### [East US](#tab/EastUS/Americas)

| Source              | East US | East US 2 |
|---------------------|---------|-----------|
| Australia Central   | 203     | 198       |
| Australia Central 2 | 203     | 198       |
| Australia East      | 201     | 197       |
| Australia Southeast | 213     | 207       |
| Brazil South        | 119     | 118       |
| Canada Central      | 20      | 23        |
| Canada East         | 29      | 32        |
| Central India       | 203     | 205       |
| Central US          | 33      | 37        |
| East Asia           | 213     | 206       |
| East US             |         | 9         |
| East US 2           | 10      |           |
| France Central      | 90      | 85        |
| France South        | 85      | 89        |
| Germany North       | 103     | 99        |
| Germany West Central| 96      | 92        |
| Israel Central      | 126     | 130       |
| Italy North         | 97      | 101       |
| Japan East          | 170     | 163       |
| Japan West          | 177     | 170       |
| Korea Central       | 229     | 198       |
| Korea South         | 188     | 182       |
| North Central US    | 24      | 27        |
| North Europe        | 88      | 95        |
| Norway East         | 108     | 110       |
| Norway West         | 102     | 103       |
| Poland North        | 113     | 112       |
| Qatar Central       | 196     | 199       |
| South Africa North  | 227     | 230       |
| South Africa West   | 210     | 214       |
| South Central US    | 38      | 33        |
| South India         | 225     | 230       |
| Southeast Asia      | 234     | 233       |
| Sweden Central      | 119     | 117       |
| Switzerland North   | 99      | 103       |
| Switzerland West    | 93      | 97        |
| UAE Central         | 184     | 188       |
| UAE North           | 187     | 190       |
| UK South            | 79      | 89        |
| UK West             | 83      | 92        |
| West Central US     | 47      | 51        |
| West Europe         | 90      | 91        |
| West US             | 74      | 67        |
| West US 2           | 69      | 73        |
| West US 3           | 60      | 56        |

#### [Canada / Brazil](#tab/Canada/Americas)

| Source              | Brazil South | Canada Central | Canada East |
|---------------------|--------------|----------------|-------------|
| Australia Central   | 304          | 201            | 211         |
| Australia Central 2 | 304          | 200            | 211         |
| Australia East      | 316          | 196            | 206         |
| Australia Southeast | 312          | 207            | 216         |
| Brazil South        |              | 131            | 136         |
| Canada Central      | 130          |                | 15          |
| Canada East         | 135          | 15             |             |
| Central India       | 307          | 213            | 218         |
| Central US          | 149          | 25             | 34          |
| East Asia           | 320          | 203            | 212         |
| East US             | 116          | 18             | 28          |
| East US 2           | 116          | 23             | 33          |
| France Central      | 190          | 103            | 113         |
| France South        | 186          | 99             | 109         |
| Germany North       | 204          | 117            | 126         |
| Germany West Central| 197          | 110            | 119         |
| Israel Central      | 226          | 138            | 144         |
| Italy North         | 197          | 110            | 117         |
| Japan East          | 278          | 159            | 169         |
| Japan West          | 281          | 166            | 176         |
| Korea Central       | 302          | 236            | 193         |
| Korea South         | 308          | 179            | 188         |
| North Central US    | 137          | 18             | 28          |
| North Europe        | 187          | 99             | 106         |
| Norway East         | 211          | 114            | 124         |
| Norway West         | 199          | 110            | 115         |
| Poland North        | 210          | 123            | 129         |
| Qatar Central       | 296          | 208            | 213         |
| South Africa North  | 326          | 239            | 244         |
| South Africa West   | 311          | 223            | 228         |
| South Central US    | 142          | 48             | 58          |
| South India         | 326          | 237            | 242         |
| Southeast Asia      | 343          | 223            | 233         |
| Sweden Central      | 213          | 125            | 131         |
| Switzerland North   | 199          | 111            | 119         |
| Switzerland West    | 193          | 106            | 116         |
| UAE Central         | 284          | 196            | 202         |
| UAE North           | 287          | 199            | 204         |
| UK South            | 179          | 90             | 99          |
| UK West             | 181          | 93             | 102         |
| West Central US     | 162          | 39             | 49          |
| West Europe         | 185          | 95             | 102         |
| West US             | 186          | 62             | 71          |
| West US 2           | 184          | 62             | 71          |
| West US 3           | 163          | 66             | 75          |


#### [Australia](#tab/Australia/APAC)

| Source              | Australia Central | Australia Central 2 | Australia East | Australia Southeast |
|---------------------|-------------------|---------------------|----------------|---------------------|
| Australia Central   |                   | 3                   | 10             | 18                  |
| Australia Central 2 | 4                 |                     | 9              | 15                  |
| Australia East      | 10                | 9                   |                | 16                  |
| Australia Southeast | 19                | 15                  | 16             |                     |
| Brazil South        | 305               | 304                 | 317            | 312                 |
| Canada Central      | 201               | 199                 | 194            | 205                 |
| Canada East         | 210               | 209                 | 204            | 214                 |
| Central India       | 148               | 147                 | 147            | 135                 |
| Central US          | 178               | 177                 | 174            | 185                 |
| East Asia           | 124               | 123                 | 120            | 114                 |
| East US             | 200               | 199                 | 201            | 211                 |
| East US 2           | 196               | 195                 | 198            | 204                 |
| France Central      | 287               | 278                 | 294            | 266                 |
| France South        | 275               | 267                 | 268            | 255                 |
| Germany North       | 297               | 288                 | 298            | 278                 |
| Germany West Central| 290               | 282                 | 296            | 270                 |
| Israel Central      | 314               | 307                 | 307            | 295                 |
| Italy North         | 286               | 278                 | 279            | 266                 |
| Japan East          | 108               | 107                 | 104            | 115                 |
| Japan West          | 115               | 114                 | 110            | 122                 |
| Korea Central       | 133               | 132                 | 134            | 144                 |
| Korea South         | 129               | 129                 | 136            | 137                 |
| North Central US    | 190               | 190                 | 185            | 195                 |
| North Europe        | 296               | 283                 | 290            | 281                 |
| Norway East         | 309               | 300                 | 303            | 290                 |
| Norway West         | 305               | 294                 | 307            | 286                 |
| Poland North        | 306               | 297                 | 303            | 286                 |
| Qatar Central       | 184               | 182                 | 182            | 170                 |
| South Africa North  | 280               | 278                 | 279            | 266                 |
| South Africa West   | 295               | 294                 | 295            | 282                 |
| South Central US    | 166               | 165                 | 162            | 173                 |
| South India         | 132               | 131                 | 131            | 119                 |
| Southeast Asia      | 100               | 98                  | 95             | 86                  |
| Sweden Central      | 313               | 305                 | 307            | 294                 |
| Switzerland North   | 287               | 280                 | 281            | 268                 |
| Switzerland West    | 285               | 279                 | 280            | 262                 |
| UAE Central         | 178               | 177                 | 178            | 166                 |
| UAE North           | 183               | 180                 | 180            | 168                 |
| UK South            | 287               | 275                 | 281            | 272                 |
| UK West             | 289               | 277                 | 284            | 274                 |
| West Central US     | 164               | 163                 | 160            | 171                 |
| West Europe         | 291               | 279                 | 286            | 272                 |
| West US             | 148               | 147                 | 140            | 153                 |
| West US 2           | 169               | 168                 | 162            | 174                 |
| West US 3           | 149               | 148                 | 145            | 156                 |


#### [Japan](#tab/Japan/APAC)

| Source              | Japan East | Japan West |
|---------------------|------------|------------|
| Australia Central   | 108        | 114        |
| Australia Central 2 | 107        | 114        |
| Australia East      | 103        | 110        |
| Australia Southeast | 115        | 122        |
| Brazil South        | 278        | 280        |
| Canada Central      | 158        | 165        |
| Canada East         | 167        | 174        |
| Central India       | 121        | 128        |
| Central US          | 137        | 144        |
| East Asia           | 49         | 42         |
| East US             | 169        | 175        |
| East US 2           | 160        | 167        |
| France Central      | 251        | 257        |
| France South        | 244        | 249        |
| Germany North       | 264        | 267        |
| Germany West Central| 250        | 261        |
| Israel Central      | 278        | 284        |
| Italy North         | 249        | 256        |
| Japan East          |            | 11         |
| Japan West          | 12         |            |
| Korea Central       | 33         | 19         |
| Korea South         | 27         | 13         |
| North Central US    | 149        | 155        |
| North Europe        | 252        | 257        |
| Norway East         | 272        | 276        |
| Norway West         | 264        | 269        |
| Poland North        | 277        | 279        |
| Qatar Central       | 155        | 161        |
| South Africa North  | 252        | 259        |
| South Africa West   | 268        | 274        |
| South Central US    | 127        | 134        |
| South India         | 104        | 111        |
| Southeast Asia      | 72         | 75         |
| Sweden Central      | 279        | 283        |
| Switzerland North   | 256        | 263        |
| Switzerland West    | 251        | 258        |
| UAE Central         | 152        | 160        |
| UAE North           | 155        | 162        |
| UK South            | 244        | 249        |
| UK West             | 245        | 251        |
| West Central US     | 123        | 129        |
| West Europe         | 250        | 253        |
| West US             | 108        | 114        |
| West US 2           | 100        | 107        |
| West US 3           | 111        | 117        |

#### [Western Europe](#tab/WesternEurope/Europe)

| Source              | France Central | France South | Italy North | West Europe |
|---------------------|----------------|--------------|-------------|-------------|
| Australia Central   | 285            | 274          | 288         | 291         |
| Australia Central 2 | 278            | 267          | 282         | 281         |
| Australia East      | 293            | 267          | 281         | 287         |
| Australia Southeast | 266            | 255          | 267         | 273         |
| Brazil South        | 190            | 186          | 198         | 186         |
| Canada Central      | 102            | 98           | 110         | 95          |
| Canada East         | 111            | 107          | 117         | 104         |
| Central India       | 126            | 131          | 137         | 135         |
| Central US          | 116            | 116          | 128         | 118         |
| East Asia           | 212            | 201          | 216         | 219         |
| East US             | 87             | 83           | 96          | 89          |
| East US 2           | 84             | 88           | 100         | 91          |
| France Central      |                | 14           | 25          | 12          |
| France South        | 15             |              | 16          | 22          |
| Germany North       | 19             | 26           | 28          | 16          |
| Germany West Central| 11             | 19           | 20          | 11          |
| Israel Central      | 55             | 44           | 51          | 69          |
| Italy North         | 24             | 15           |             | 25          |
| Japan East          | 252            | 244          | 252         | 251         |
| Japan West          | 257            | 249          | 259         | 254         |
| Korea Central       | 247            | 236          | 250         | 254         |
| Korea South         | 241            | 229          | 243         | 248         |
| North Central US    | 107            | 102          | 117         | 109         |
| North Europe        | 19             | 28           | 41          | 19          |
| Norway East         | 32             | 41           | 39          | 25          |
| Norway West         | 25             | 35           | 39          | 18          |
| Poland North        | 28             | 35           | 34          | 23          |
| Qatar Central       | 124            | 114          | 126         | 132         |
| South Africa North  | 156            | 154          | 167         | 163         |
| South Africa West   | 141            | 138          | 152         | 147         |
| South Central US    | 110            | 114          | 126         | 118         |
| South India         | 148            | 155          | 162         | 156         |
| Southeast Asia      | 183            | 179          | 190         | 190         |
| Sweden Central      | 35             | 43           | 42          | 27          |
| Switzerland North   | 18             | 17           | 15          | 19          |
| Switzerland West    | 13             | 10           | 15          | 20          |
| UAE Central         | 115            | 103          | 115         | 122         |
| UAE North           | 116            | 104          | 117         | 123         |
| UK South            | 10             | 20           | 32          | 11          |
| UK West             | 13             | 23           | 35          | 15          |
| West Central US     | 129            | 129          | 141         | 132         |
| West Europe         | 11             | 21           | 24          |             |
| West US             | 149            | 153          | 165         | 155         |
| West US 2           | 151            | 149          | 163         | 154         |
| West US 3           | 136            | 139          | 147         | 139         |


#### [Central Europe](#tab/CentralEurope/Europe)

| Source              | Germany North | Germany West Central | Poland North | Switzerland North | Switzerland West |
|---------------------|---------------|----------------------|--------------|-------------------|------------------|
| Australia Central   | 296           | 292                  | 305          | 284               | 284              |
| Australia Central 2 | 288           | 284                  | 297          | 278               | 279              |
| Australia East      | 297           | 296                  | 301          | 278               | 279              |
| Australia Southeast | 277           | 272                  | 286          | 265               | 261              |
| Brazil South        | 204           | 199                  | 209          | 197               | 193              |
| Canada Central      | 115           | 110                  | 126          | 109               | 104              |
| Canada East         | 124           | 119                  | 135          | 118               | 113              |
| Central India       | 140           | 135                  | 150          | 139               | 132              |
| Central US          | 130           | 126                  | 141          | 127               | 123              |
| East Asia           | 223           | 219                  | 233          | 212               | 214              |
| East US             | 101           | 96                   | 111          | 94                | 90               |
| East US 2           | 97            | 92                   | 108          | 99                | 95               |
| France Central      | 18            | 13                   | 27           | 16                | 13               |
| France South        | 26            | 21                   | 35           | 15                | 10               |
| Germany North       |               | 13                   | 13           | 16                | 18               |
| Germany West Central| 11            |                      | 20           | 8                 | 11               |
| Israel Central      | 67            | 61                   | 69           | 48                | 51               |
| Italy North         | 25            | 20                   | 34           | 13                | 13               |
| Japan East          | 263           | 252                  | 276          | 254               | 250              |
| Japan West          | 267           | 263                  | 279          | 262               | 258              |
| Korea Central       | 258           | 254                  | 267          | 247               | 249              |
| Korea South         | 252           | 247                  | 261          | 240               | 236              |
| North Central US    | 121           | 115                  | 131          | 114               | 110              |
| North Europe        | 33            | 28                   | 39           | 33                | 27               |
| Norway East         | 23            | 27                   | 31           | 30                | 33               |
| Norway West         | 27            | 27                   | 35           | 30                | 33               |
| Poland North        | 13            | 22                   |              | 25                | 27               |
| Qatar Central       | 136           | 131                  | 145          | 125               | 122              |
| South Africa North  | 170           | 164                  | 179          | 165               | 161              |
| South Africa West   | 154           | 151                  | 163          | 148               | 145              |
| South Central US    | 127           | 123                  | 137          | 127               | 124              |
| South India         | 159           | 153                  | 165          | 163               | 150              |
| Southeast Asia      | 193           | 189                  | 202          | 185               | 184              |
| Sweden Central      | 21            | 30                   | 27           | 32                | 35               |
| Switzerland North   | 18            | 12                   | 27           |                   | 8                |
| Switzerland West    | 19            | 14                   | 28           | 7                 |                  |
| UAE Central         | 125           | 120                  | 134          | 113               | 110              |
| UAE North           | 127           | 122                  | 136          | 116               | 112              |
| UK South            | 24            | 19                   | 31           | 24                | 18               |
| UK West             | 26            | 20                   | 34           | 28                | 20               |
| West Central US     | 142           | 140                  | 154          | 141               | 136              |
| West Europe         | 16            | 12                   | 24           | 16                | 19               |
| West US             | 163           | 162                  | 173          | 163               | 159              |
| West US 2           | 164           | 160                  | 176          | 162               | 158              |
| West US 3           | 152           | 147                  | 159          | 150               | 146              |


#### [Norway / Sweden](#tab/NorwaySweden/Europe)

| Source              | Norway East | Norway West | Sweden Central |
|---------------------|-------------|-------------|----------------|
| Australia Central   | 308         | 304         | 312            |
| Australia Central 2 | 300         | 294         | 305            |
| Australia East      | 302         | 306         | 306            |
| Australia Southeast | 290         | 286         | 294            |
| Brazil South        | 210         | 199         | 213            |
| Canada Central      | 113         | 108         | 123            |
| Canada East         | 122         | 113         | 129            |
| Central India       | 153         | 146         | 157            |
| Central US          | 136         | 129         | 141            |
| East Asia           | 236         | 232         | 240            |
| East US             | 105         | 97          | 117            |
| East US 2           | 108         | 101         | 116            |
| France Central      | 31          | 25          | 35             |
| France South        | 41          | 35          | 43             |
| Germany North       | 23          | 27          | 21             |
| Germany West Central| 25          | 25          | 28             |
| Israel Central      | 83          | 81          | 85             |
| Italy North         | 38          | 37          | 41             |
| Japan East          | 272         | 264         | 279            |
| Japan West          | 276         | 268         | 283            |
| Korea Central       | 271         | 267         | 275            |
| Korea South         | 265         | 260         | 268            |
| North Central US    | 127         | 117         | 132            |
| North Europe        | 39          | 34          | 43             |
| Norway East         |             | 10          | 11             |
| Norway West         | 11          |             | 17             |
| Poland North        | 29          | 34          | 26             |
| Qatar Central       | 149         | 144         | 153            |
| South Africa North  | 183         | 176         | 186            |
| South Africa West   | 167         | 160         | 170            |
| South Central US    | 136         | 132         | 141            |
| South India         | 170         | 162         | 173            |
| Southeast Asia      | 206         | 202         | 210            |
| Sweden Central      | 11          | 17          |                |
| Switzerland North   | 31          | 32          | 35             |
| Switzerland West    | 33          | 33          | 36             |
| UAE Central         | 137         | 133         | 141            |
| UAE North           | 140         | 135         | 144            |
| UK South            | 30          | 24          | 33             |
| UK West             | 33          | 25          | 38             |
| West Central US     | 149         | 142         | 161            |
| West Europe         | 23          | 17          | 27             |
| West US             | 170         | 166         | 182            |
| West US 2           | 170         | 167         | 181            |
| West US 3           | 157         | 148         | 165            |

#### [UK / North Europe](#tab/UKNorthEurope/Europe)

| Source                | North Europe | UK South | UK West |
|-----------------------|--------------|----------|---------|
| Australia Central     | 296          | 287      | 290     |
| Australia Central 2   | 286          | 276      | 278     |
| Australia East        | 291          | 280      | 284     |
| Australia Southeast   | 282          | 272      | 275     |
| Brazil South          | 189          | 179      | 182     |
| Canada Central        | 99           | 89       | 92      |
| Canada East           | 108          | 98       | 101     |
| Central India         | 146          | 131      | 137     |
| Central US            | 113          | 104      | 104     |
| East Asia             | 227          | 217      | 220     |
| East US               | 87           | 77       | 82      |
| East US 2             | 96           | 88       | 91      |
| France Central        | 20           | 10       | 13      |
| France South          | 30           | 20       | 23      |
| Germany North         | 35           | 25       | 27      |
| Germany West Central  | 27           | 17       | 19      |
| Israel Central        | 72           | 61       | 64      |
| Italy North           | 42           | 31       | 35      |
| Japan East            | 253          | 244      | 245     |
| Japan West            | 259          | 249      | 252     |
| Korea Central         | 263          | 252      | 255     |
| Korea South           | 256          | 246      | 249     |
| North Central US      | 105          | 94       | 98      |
| North Europe          |              | 13       | 16      |
| Norway East           | 40           | 30       | 34      |
| Norway West           | 35           | 25       | 27      |
| Poland North          | 41           | 31       | 35      |
| Qatar Central         | 140          | 130      | 133     |
| South Africa North    | 172          | 162      | 165     |
| South Africa West     | 158          | 147      | 151     |
| South Central US      | 123          | 114      | 117     |
| South India           | 162          | 149      | 156     |
| Southeast Asia        | 198          | 188      | 190     |
| Sweden Central        | 44           | 34       | 39      |
| Switzerland North     | 36           | 25       | 29      |
| Switzerland West      | 28           | 18       | 21      |
| UAE Central           | 130          | 119      | 122     |
| UAE North             | 131          | 122      | 124     |
| UK South              | 14           |          | 8       |
| UK West               | 17           | 7        |         |
| West Central US       | 132          | 123      | 127     |
| West Europe           | 20           | 10       | 13      |
| West US               | 159          | 147      | 152     |
| West US 2             | 155          | 147      | 150     |
| West US 3             | 143          | 133      | 136     |




#### [Korea](#tab/Korea/APAC)

| Source              | Korea Central | Korea South |
|---------------------|---------------|-------------|
| Australia Central   | 132           | 129         |
| Australia Central 2 | 132           | 129         |
| Australia East      | 131           | 135         |
| Australia Southeast | 143           | 137         |
| Brazil South        | 303           | 309         |
| Canada Central      | 235           | 177         |
| Canada East         | 191           | 187         |
| Central India       | 118           | 111         |
| Central US          | 198           | 160         |
| East Asia           | 40            | 33          |
| East US             | 224           | 185         |
| East US 2           | 188           | 180         |
| France Central      | 247           | 240         |
| France South        | 236           | 229         |
| Germany North       | 258           | 252         |
| Germany West Central| 251           | 244         |
| Israel Central      | 276           | 269         |
| Italy North         | 248           | 241         |
| Japan East          | 32            | 26          |
| Japan West          | 19            | 13          |
| Korea Central       |               | 9           |
| Korea South         | 10            |             |
| North Central US    | 218           | 173         |
| North Europe        | 261           | 254         |
| Norway East         | 271           | 265         |
| Norway West         | 267           | 260         |
| Poland North        | 267           | 261         |
| Qatar Central       | 152           | 145         |
| South Africa North  | 250           | 241         |
| South Africa West   | 265           | 257         |
| South Central US    | 165           | 150         |
| South India         | 101           | 94          |
| Southeast Asia      | 69            | 62          |
| Sweden Central      | 275           | 268         |
| Switzerland North   | 249           | 242         |
| Switzerland West    | 249           | 236         |
| UAE Central         | 149           | 144         |
| UAE North           | 152           | 145         |
| UK South            | 252           | 245         |
| UK West             | 255           | 248         |
| West Central US     | 154           | 149         |
| West Europe         | 253           | 246         |
| West US             | 159           | 131         |
| West US 2           | 124           | 124         |
| West US 3           | 147           | 132         |


#### [India](#tab/India/APAC)

| Source              | Central India | South India | West India |
|---------------------|---------------|-------------|------------|
| Australia Central   | 148           | 131         | 173        |
| Australia Central 2 | 149           | 131         | 172        |
| Australia East      | 147           | 131         | 170        |
| Australia Southeast | 137           | 119         | 160        |
| Brazil South        | 307           | 327         | 322        |
| Canada Central      | 213           | 236         | 235        |
| Canada East         | 218           | 240         | 239        |
| Central India       |               | 24          | 29         |
| Central US          | 233           | 232         | 254        |
| East Asia           | 84            | 66          | 105        |
| East US             | 200           | 224         | 222        |
| East US 2           | 206           | 228         | 225        |
| France Central      | 127           | 148         | 147        |
| France South        | 132           | 154         | 153        |
| Germany North       | 142           | 159         | 162        |
| Germany West Central| 134           | 151         | 153        |
| Israel Central      | 159           | 174         | 182        |
| Italy North         | 138           | 159         | 154        |
| Japan East          | 122           | 104         | 143        |
| Japan West          | 129           | 111         | 150        |
| Korea Central       | 119           | 101         | 140        |
| Korea South         | 113           | 95          | 134        |
| North Central US    | 225           | 248         | 243        |
| North Europe        | 146           | 160         | 164        |
| Norway East         | 154           | 170         | 176        |
| Norway West         | 148           | 162         | 172        |
| Poland North        | 151           | 165         | 173        |
| Qatar Central       | 41            | 55          | 65         |
| South Africa North  | 138           | 153         | 158        |
| South Africa West   | 153           | 168         | 174        |
| South Central US    | 230           | 230         | 252        |
| South India         | 26            |             | 44         |
| Southeast Asia      | 55            | 36          | 77         |
| Sweden Central      | 158           | 173         | 180        |
| Switzerland North   | 141           | 164         | 161        |
| Switzerland West    | 133           | 151         | 154        |
| UAE Central         | 35            | 53          | 56         |
| UAE North           | 38            | 56          | 62         |
| UK South            | 133           | 149         | 155        |
| UK West             | 138           | 155         | 158        |
| West Central US     | 240           | 222         | 262        |
| West Europe         | 136           | 160         | 155        |
| West US             | 221           | 203         | 242        |
| West US 2           | 214           | 196         | 234        |
| West US 3           | 232           | 214         | 253        |


> [!NOTE]
> Round-trip latency to West India from other Azure regions is included in the table. However, West India is not a source region so roundtrips from West India are not included in the table.]

#### [Asia](#tab/Asia/APAC)

| Source              | East Asia | Southeast Asia |
|---------------------|-----------|----------------|
| Australia Central   | 127       | 101            |
| Australia Central 2 | 127       | 100            |
| Australia East      | 123       | 91             |
| Australia Southeast | 119       | 86             |
| Brazil South        | 323       | 344            |
| Canada Central      | 205       | 223            |
| Canada East         | 215       | 232            |
| Central India       | 87        | 55             |
| Central US          | 184       | 202            |
| East Asia           |           | 36             |
| East US             | 215       | 233            |
| East US 2           | 208       | 232            |
| France Central      | 217       | 186            |
| France South        | 206       | 181            |
| Germany North       | 228       | 195            |
| Germany West Central| 220       | 188            |
| Israel Central      | 245       | 213            |
| Italy North         | 218       | 188            |
| Japan East          | 52        | 73             |
| Japan West          | 46        | 73             |
| Korea Central       | 43        | 70             |
| Korea South         | 37        | 64             |
| North Central US    | 195       | 213            |
| North Europe        | 229       | 198            |
| Norway East         | 240       | 208            |
| Norway West         | 236       | 204            |
| Poland North        | 237       | 205            |
| Qatar Central       | 121       | 90             |
| South Africa North  | 218       | 188            |
| South Africa West   | 233       | 203            |
| South Central US    | 174       | 204            |
| South India         | 70        | 38             |
| Southeast Asia      |           | 38             |
| Sweden Central      | 244       | 212            |
| Switzerland North   | 219       | 189            |
| Switzerland West    | 217       | 187            |
| UAE Central         | 119       | 87             |
| UAE North           | 121       | 90             |
| UK South            | 221       | 189            |
| UK West             | 223       | 191            |
| West Central US     | 170       | 188            |
| West Europe         | 222       | 190            |
| West US             | 154       | 172            |
| West US 2           | 147       | 165            |
| West US 3           | 158       | 188            |

#### [Israel / Qatar / UAE](#tab/israel-qatar-uae/MiddleEast)

| Source              | Israel Central | Qatar Central | UAE Central | UAE North |
|---------------------|----------------|---------------|-------------|-----------|
| Australia Central   | 313            | 184           | 178         | 182       |
| Australia Central 2 | 307            | 183           | 178         | 181       |
| Australia East      | 306            | 182           | 177         | 180       |
| Australia Southeast | 294            | 171           | 165         | 168       |
| Brazil South        | 226            | 296           | 284         | 287       |
| Canada Central      | 136            | 208           | 195         | 198       |
| Canada East         | 142            | 212           | 200         | 203       |
| Central India       | 158            | 41            | 34          | 37        |
| Central US          | 155            | 227           | 214         | 217       |
| East Asia           | 241            | 118           | 116         | 118       |
| East US             | 123            | 194           | 182         | 184       |
| East US 2           | 128            | 198           | 186         | 189       |
| France Central      | 54             | 125           | 114         | 116       |
| France South        | 44             | 114           | 102         | 105       |
| Germany North       | 67             | 138           | 125         | 128       |
| Germany West Central| 59             | 130           | 118         | 120       |
| Israel Central      |                | 155           | 142         | 145       |
| Italy North         | 50             | 126           | 113         | 116       |
| Japan East          | 277            | 156           | 152         | 155       |
| Japan West          | 284            | 163           | 160         | 162       |
| Korea Central       | 276            | 153           | 149         | 152       |
| Korea South         | 269            | 146           | 144         | 146       |
| North Central US    | 144            | 214           | 202         | 205       |
| North Europe        | 70             | 139           | 127         | 129       |
| Norway East         | 83             | 150           | 138         | 140       |
| Norway West         | 81             | 146           | 134         | 136       |
| Poland North        | 69             | 146           | 134         | 136       |
| Qatar Central       | 153            |               | 16          | 17        |
| South Africa North  | 195            | 117           | 105         | 102       |
| South Africa West   | 183            | 132           | 121         | 118       |
| South Central US    | 153            | 224           | 212         | 214       |
| South India         | 173            | 55            | 52          | 56        |
| Southeast Asia      | 211            | 88            | 85          | 88        |
| Sweden Central      | 84             | 154           | 141         | 144       |
| Switzerland North   | 50             | 128           | 115         | 118       |
| Switzerland West    | 51             | 124           | 110         | 112       |
| UAE Central         | 142            | 17            |             | 6         |
| UAE North           | 144            | 18            | 6           |           |
| UK South            | 61             | 131           | 119         | 121       |
| UK West             | 64             | 133           | 120         | 123       |
| West Central US     | 170            | 240           | 227         | 230       |
| West Europe         | 67             | 132           | 121         | 122       |
| West US             | 193            | 263           | 251         | 254       |
| West US 2           | 190            | 255           | 249         | 251       |
| West US 3           | 171            | 242           | 229         | 232       |


### [South Africa](#tab/southafrica/MiddleEast)

| Source              | South Africa North | South Africa West |
|---------------------|--------------------|------------------|
| Australia Central   | 280                | 295              |
| Australia Central 2 | 281                | 294              |
| Australia East      | 280                | 294              |
| Australia Southeast | 268                | 282              |
| Brazil South        | 327                | 311              |
| Canada Central      | 239                | 221              |
| Canada East         | 243                | 226              |
| Central India       | 137                | 151              |
| Central US          | 258                | 241              |
| East Asia           | 216                | 230              |
| East US             | 225                | 208              |
| East US 2           | 230                | 213              |
| France Central      | 157                | 141              |
| France South        | 155                | 138              |
| Germany North       | 171                | 154              |
| Germany West Central| 164                | 148              |
| Israel Central      | 196                | 183              |
| Italy North         | 168                | 150              |
| Japan East          | 253                | 267              |
| Japan West          | 261                | 274              |
| Korea Central       | 251                | 265              |
| Korea South         | 244                | 258              |
| North Central US    | 246                | 228              |
| North Europe        | 172                | 155              |
| Norway East         | 184                | 167              |
| Norway West         | 177                | 160              |
| Poland North        | 180                | 163              |
| Qatar Central       | 118                | 131              |
| South Africa North  |                    | 20               |
| South Africa West   | 21                 |                  |
| South Central US    | 256                | 238              |
| South India         | 154                | 169              |
| Southeast Asia      | 187                | 201              |
| Sweden Central      | 188                | 170              |
| Switzerland North   | 168                | 150              |
| Switzerland West    | 163                | 145              |
| UAE Central         | 108                | 121              |
| UAE North           | 104                | 118              |
| UK South            | 163                | 146              |
| UK West             | 165                | 150              |
| West Central US     | 271                | 254              |
| West Europe         | 163                | 146              |
| West US             | 295                | 277              |
| West US 2           | 292                | 275              |
| West US 3           | 274                | 256              |


---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table" lightbox="media/azure-network-latency/azure-network-latency-thumb.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
