---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: virtual-network
ms.topic: article
ms.date: 04/10/2024
ms.author: mbender
ms.custom: references_regions,updatedFY24S2
---

# Azure network round-trip latency statistics

Azure continuously monitors the latency (speed) of core areas of its network using internal monitoring tools and measurements.

## How are the measurements collected?

The latency measurements are collected from Azure cloud regions worldwide, and continuously measured in 1-minute intervals by network probes. The monthly latency statistics are derived from averaging the collected samples for the month.

## Round-trip latency figures

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *April 9th, 2024*, and it covers the 30-day period ending on *April 9th, 2024*.

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

| Source              | North Central US | Central US | South Central US | West Central US |
|---------------------|------------------|------------|------------------|-----------------|
| Australia Central   | 26               | 26         | 49               | 45              |
| Australia Central 2 | 34               | 32         | 57               | 54              |
| Australia East      | 27               | 17         | 25               |                 |
| Australia Southeast | 120              | 132        | 130              | 142             |
| Brazil South        | 26               | 33         | 33               | 49              |
| Canada Central      | 52               | 45         | 22               | 33              |
| Canada East         | 48               | 39         | 46               | 25              |
| Central India       | 120              | 123        | 136              | 150             |
| Central US          | 116              | 125        | 128              | 139             |
| East Asia           | 150              | 143        | 134              | 129             |
| East US             | 184              | 176        | 173              | 163             |
| East US 2           | 191              | 184        | 173              | 170             |
| France Central      | 243              | 231        | 236              | 219             |
| France South        | 121              | 129        | 134              | 144             |
| Germany North       | 103              | 110        | 120              | 128             |
| Germany West Central| 154              | 164        | 161              | 179             |
| Israel Central      | 168              | 161        | 154              | 147             |
| Italy North         | 166              | 155        | 144              | 142             |
| Japan East          | 102              | 109        | 114              | 126             |
| Japan West          | 34               | 26         |                  | 25              |
| Korea Central       | 211              | 223        | 215              | 237             |
| Korea South         | 109              | 116        | 126              | 129             |
| North Central US    | 228              | 240        | 231              | 234             |
| North Europe        | 108              | 115        | 125              | 130             |
| Norway East         | 253              | 264        | 261              | 278             |
| Norway West         | 237              | 248        | 245              | 262             |
| Poland Central      | 207              | 199        | 198              | 185             |
| Qatar Central       | 105              | 111        | 121              | 126             |
| South Africa North  |                  | 11         | 35               | 27              |
| South Africa West   | 22               | 30         | 36               | 46              |
| South Central US    | 96               | 100        | 110              | 118             |
| South India         | 115              | 121        | 131              | 135             |
| Southeast Asia      | 94               | 98         | 110              | 117             |
| Sweden Central      | 211              | 223        | 216              | 236             |
| Switzerland North   | 109              | 116        | 125              | 129             |
| Switzerland West    | 187              | 179        | 170              | 166             |
| UAE Central         | 190              | 177        | 166              | 163             |
| UAE North           | 143              | 136        | 127              | 122             |
| UK South            | 89               | 96         | 100              | 114             |
| UK West             | 102              | 109        | 111              | 125             |
| West Central US     | 107              | 113        | 123              | 127             |
| West Europe         | 190              | 177        | 165              | 163             |
| West US             | 137              | 149        | 143              | 163             |
| West US 2           | 219              | 231        | 223              | 245             |
| West US 3           | 49               | 40         | 36               | 26              |

#### [Central US](#tab/CentralUS/Americas)

| Source              | North Central US | Central US | South Central US | West Central US |
|---------------------|------------------|------------|------------------|-----------------|
| Australia Central   | 190              | 177        | 165              | 163             |
| Australia Central 2 | 190              | 177        | 166              | 163             |
| Australia East      | 184              | 176        | 173              | 163             |
| Australia Southeast | 191              | 184        | 173              | 170             |
| Brazil South        | 137              | 149        | 143              | 163             |
| Canada Central      | 26               | 26         | 49               | 45              |
| Canada East         | 34               | 32         | 57               | 54              |
| Central India       | 228              | 240        | 231              | 234             |
| Central US          | 10               |            | 27               | 17              |
| East Asia           | 187              | 179        | 170              | 166             |
| East US             | 22               | 30         | 36               | 46              |
| East US 2           | 26               | 33         | 33               | 49              |
| France Central      | 102              | 109        | 111              | 125             |
| France South        | 107              | 113        | 123              | 127             |
| Germany North       | 108              | 115        | 125              | 130             |
| Germany West Central| 103              | 110        | 120              | 128             |
| Israel Central      | 154              | 164        | 161              | 179             |
| Italy North         | 116              | 125        | 128              | 139             |
| Japan East          | 143              | 136        | 127              | 122             |
| Japan West          | 150              | 143        | 134              | 129             |
| Korea Central       | 168              | 161        | 154              | 147             |
| Korea South         | 166              | 155        | 144              | 142             |
| North Central US    |                  | 11         | 35               | 27              |
| North Europe        | 89               | 96         | 100              | 114             |
| Norway East         | 115              | 121        | 131              | 135             |
| Norway West         | 120              | 132        | 130              | 142             |
| Poland Central      | 121              | 129        | 134              | 144             |
| Qatar Central       | 219              | 231        | 223              | 245             |
| South Africa North  | 253              | 264        | 261              | 278             |
| South Africa West   | 237              | 248        | 245              | 262             |
| South Central US    | 34               | 26         |                  | 25              |
| South India         | 243              | 231        | 236              | 219             |
| Southeast Asia      | 207              | 199        | 198              | 185             |
| Sweden Central      | 120              | 123        | 136              | 150             |
| Switzerland North   | 109              | 116        | 126              | 129             |
| Switzerland West    | 105              | 111        | 121              | 126             |
| UAE Central         | 211              | 223        | 215              | 237             |
| UAE North           | 211              | 223        | 216              | 236             |
| UK South            | 94               | 98         | 110              | 117             |
| UK West             | 96               | 100        | 110              | 118             |
| West Central US     | 27               | 17         | 25               |                 |
| West Europe         | 102              | 109        | 114              | 126             |
| West US             | 49               | 40         | 36               | 26              |
| West US 2           | 48               | 39         | 46               | 25              |
| West US 3           | 52               | 45         | 22               | 33              |

#### [East US](#tab/EastUS/Americas)

| Source              | East US | East US 2 |
|---------------------|---------|-----------|
| Australia Central   | 201     | 198       |
| Australia Central 2 | 201     | 197       |
| Australia East      | 204     | 201       |
| Australia Southeast | 204     | 200       |
| Brazil South        | 118     | 117       |
| Canada Central      | 22      | 25        |
| Canada East         | 29      | 32        |
| Central India       | 210     | 207       |
| Central US          | 32      | 33        |
| East Asia           | 204     | 207       |
| East US             |         | 8         |
| East US 2           | 9       |           |
| France Central      | 84      | 84        |
| France South        | 94      | 96        |
| Germany North       | 96      | 100       |
| Germany West Central| 90      | 94        |
| Israel Central      | 134     | 135       |
| Italy North         | 101     | 101       |
| Japan East          | 158     | 153       |
| Japan West          | 165     | 160       |
| Korea Central       | 184     | 187       |
| Korea South         | 180     | 175       |
| North Central US    | 24      | 28        |
| North Europe        | 70      | 74        |
| Norway East         | 102     | 105       |
| Norway West         | 99      | 103       |
| Poland Central      | 104     | 107       |
| Qatar Central       | 200     | 197       |
| South Africa North  | 233     | 235       |
| South Africa West   | 217     | 219       |
| South Central US    | 37      | 30        |
| South India         | 223     | 221       |
| Southeast Asia      | 227     | 226       |
| Sweden Central      | 104     | 108       |
| Switzerland North   | 96      | 98        |
| Switzerland West    | 92      | 94        |
| UAE Central         | 193     | 190       |
| UAE North           | 193     | 190       |
| UK South            | 78      | 82        |
| UK West             | 80      | 84        |
| West Central US     | 48      | 49        |
| West Europe         | 84      | 87        |
| West US             | 69      | 62        |
| West US 2           | 67      | 66        |
| West US 3           | 56      | 50        |

#### [Canada / Brazil](#tab/Canada/Americas)

|Source region|Brazil</br>South|Canada</br>Central|Canada</br>East|
|---------------------|--------------|----------------|-------------|
| Australia Central   | 304          | 201            | 209         |
| Australia Central 2 | 304          | 202            | 209         |
| Australia East      | 311          | 199            | 206         |
| Australia Southeast | 312          | 206            | 213         |
| Brazil South        |              | 132            | 139         |
| Canada Central      | 131          |                | 15          |
| Canada East         | 139          | 15             |             |
| Central India       | 311          | 222            | 229         |
| Central US          | 149          | 26             | 33          |
| East Asia           | 331          | 200            | 208         |
| East US             | 117          | 20             | 27          |
| East US 2           | 116          | 24             | 31          |
| France Central      | 185          | 97             | 103         |
| France South        | 195          | 107            | 113         |
| Germany North       | 197          | 109            | 115         |
| Germany West Central| 192          | 103            | 109         |
| Israel Central      | 235          | 147            | 153         |
| Italy North         | 202          | 113            | 119         |
| Japan East          | 280          | 157            | 165         |
| Japan West          | 288          | 164            | 172         |
| Korea Central       | 303          | 182            | 189         |
| Korea South         | 301          | 177            | 185         |
| North Central US    | 137          | 26             | 34          |
| North Europe        | 171          | 85             | 93          |
| Norway East         | 205          | 115            | 122         |
| Norway West         | 201          | 110            | 119         |
| Poland Central      | 206          | 118            | 124         |
| Qatar Central       | 301          | 213            | 220         |
| South Africa North  | 334          | 246            | 253         |
| South Africa West   | 318          | 230            | 238         |
| South Central US    | 142          | 50             | 58          |
| South India         | 324          | 235            | 243         |
| Southeast Asia      | 343          | 221            | 228         |
| Sweden Central      | 208          | 119            | 124         |
| Switzerland North   | 201          | 110            | 115         |
| Switzerland West    | 194          | 105            | 112         |
| UAE Central         | 293          | 205            | 213         |
| UAE North           | 293          | 205            | 212         |
| UK South            | 180          | 92             | 98          |
| UK West             | 182          | 94             | 100         |
| West Central US     | 163          | 46             | 54          |
| West Europe         | 185          | 97             | 103         |
| West US             | 186          | 68             | 81          |
| West US 2           | 184          | 67             | 75          |
| West US 3           | 166          | 67             | 74          |

#### [Australia](#tab/Australia/APAC)

| Source | Australia</br>Central | Australia</br>Central 2 | Australia</br>East | Australia</br>Southeast |
|---------------------|-------------------|---------------------|----------------|---------------------|
| Australia Central   |                   | 3                   | 9              | 18                  |
| Australia Central 2 | 3                 |                     | 9              | 15                  |
| Australia East      | 9                 | 9                   |                | 16                  |
| Australia Southeast | 18                | 15                  | 16             |                     |
| Brazil South        | 304               | 304                 | 310            | 312                 |
| Canada Central      | 200               | 202                 | 199            | 206                 |
| Canada East         | 209               | 209                 | 206            | 213                 |
| Central India       | 145               | 144                 | 140            | 136                 |
| Central US          | 177               | 177                 | 177            | 184                 |
| East Asia           | 123               | 123                 | 119            | 119                 |
| East US             | 202               | 199                 | 202            | 203                 |
| East US 2           | 196               | 195                 | 203            | 203                 |
| France Central      | 243               | 243                 | 239            | 235                 |
| France South        | 233               | 232                 | 228            | 224                 |
| Germany North       | 255               | 254                 | 250            | 246                 |
| Germany West Central| 248               | 247                 | 243            | 239                 |
| Israel Central      | 273               | 273                 | 280            | 264                 |
| Italy North         | 241               | 240                 | 236            | 232                 |
| Japan East          | 106               | 106                 | 103            | 114                 |
| Japan West          | 114               | 113                 | 110            | 122                 |
| Korea Central       | 131               | 131                 | 131            | 142                 |
| Korea South         | 123               | 123                 | 129            | 131                 |
| North Central US    | 190               | 190                 | 185            | 192                 |
| North Europe        | 258               | 259                 | 252            | 249                 |
| Norway East         | 267               | 267                 | 263            | 258                 |
| Norway West         | 263               | 263                 | 259            | 255                 |
| Poland Central      | 264               | 264                 | 259            | 255                 |
| Qatar Central       | 181               | 181                 | 176            | 172                 |
| South Africa North  | 383               | 383                 | 379            | 375                 |
| South Africa West   | 367               | 367                 | 363            | 359                 |
| South Central US    | 165               | 165                 | 173            | 173                 |
| South India         | 128               | 128                 | 123            | 119                 |
| Southeast Asia      | 95                | 95                  | 90             | 85                  |
| Sweden Central      | 271               | 271                 | 267            | 262                 |
| Switzerland North   | 244               | 243                 | 239            | 235                 |
| Switzerland West    | 240               | 238                 | 247            | 230                 |
| UAE Central         | 175               | 175                 | 168            | 164                 |
| UAE North           | 178               | 178                 | 170            | 168                 |
| UK South            | 249               | 249                 | 258            | 240                 |
| UK West             | 251               | 251                 | 259            | 242                 |
| West Central US     | 163               | 163                 | 163            | 170                 |
| West Europe         | 250               | 249                 | 258            | 241                 |
| West US             | 148               | 148                 | 140            | 153                 |
| West US 2           | 168               | 168                 | 161            | 172                 |
| West US 3           | 148               | 148                 | 156            | 156                 |

#### [Japan](#tab/Japan/APAC)

| Source               | Japan East | Japan West |
|----------------------|------------|------------|
| Australia Central    | 107        | 113        |
| Australia Central 2  | 108        | 114        |
| Australia East       | 103        | 110        |
| Australia Southeast  | 115        | 122        |
| Brazil South         | 281        | 288        |
| Canada Central       | 158        | 164        |
| Canada East          | 165        | 171        |
| Central India        | 121        | 130        |
| Central US           | 137        | 143        |
| East Asia            | 48         | 48         |
| East US              | 157        | 164        |
| East US 2            | 157        | 163        |
| France Central       | 220        | 228        |
| France South         | 209        | 217        |
| Germany North        | 231        | 239        |
| Germany West Central | 224        | 232        |
| Israel Central       | 249        | 257        |
| Italy North          | 218        | 225        |
| Japan East           |            | 11         |
| Japan West           | 12         |            |
| Korea Central        | 33         | 39         |
| Korea South          | 21         | 13         |
| North Central US     | 145        | 150        |
| North Europe         | 234        | 240        |
| Norway East          | 244        | 252        |
| Norway West          | 240        | 248        |
| Poland Central       | 240        | 248        |
| Qatar Central        | 157        | 166        |
| South Africa North   | 360        | 368        |
| South Africa West    | 344        | 352        |
| South Central US     | 127        | 133        |
| South India          | 104        | 112        |
| Southeast Asia       | 72         | 79         |
| Sweden Central       | 248        | 256        |
| Switzerland North    | 220        | 228        |
| Switzerland West     | 215        | 223        |
| UAE Central          | 152        | 156        |
| UAE North            | 154        | 159        |
| UK South             | 226        | 233        |
| UK West              | 228        | 235        |
| West Central US      | 123        | 129        |
| West Europe          | 226        | 234        |
| West US              | 108        | 114        |
| West US 2            | 100        | 106        |
| West US 3            | 110        | 116        |

#### [Western Europe](#tab/WesternEurope/Europe)

| Source              | France Central | France South | West Europe | Italy North |
|---------------------|----------------|--------------|-------------|-------------|
| Australia Central   | 243            | 232          | 251         | 245         |
| Australia Central 2 | 243            | 232          | 251         | 245         |
| Australia East      | 239            | 228          | 259         | 240         |
| Australia Southeast | 235            | 224          | 242         | 236         |
| Brazil South        | 185            | 195          | 186         | 205         |
| Canada Central      | 98             | 107          | 98          | 116         |
| Canada East         | 104            | 113          | 104         | 124         |
| Central India       | 130            | 118          | 139         | 131         |
| Central US          | 104            | 113          | 104         | 129         |
| East Asia           | 182            | 170          | 189         | 184         |
| East US             | 82             | 92           | 83          | 102         |
| East US 2           | 84             | 93           | 88          | 104         |
| France Central      |                | 14           | 12          | 25          |
| France South        | 15             |              | 22          | 16          |
| Germany North       | 19             | 26           | 15          | 26          |
| Germany West Central| 12             | 18           | 11          | 18          |
| Israel Central      | 55             | 43           | 62          | 48          |
| Italy North         | 21             | 12           | 23          |             |
| Japan East          | 219            | 208          | 226         | 220         |
| Japan West          | 228            | 217          | 235         | 230         |
| Korea Central       | 217            | 206          | 224         | 218         |
| Korea South         | 210            | 199          | 217         | 211         |
| North Central US    | 99             | 107          | 100         | 120         |
| North Europe        | 19             | 28           | 20          | 41          |
| Norway East         | 30             | 39           | 23          | 39          |
| Norway West         | 25             | 35           | 18          | 39          |
| Poland Central      | 28             | 34           | 24          | 33          |
| Qatar Central       | 121            | 110          | 129         | 123         |
| South Africa North  | 155            | 155          | 162         | 167         |
| South Africa West   | 139            | 139          | 146         | 152         |
| South Central US    | 111            | 122          | 114         | 131         |
| South India         | 148            | 134          | 154         | 145         |
| Southeast Asia      | 152            | 141          | 159         | 153         |
| Sweden Central      | 36             | 42           | 25          | 42          |
| Switzerland North   | 16             | 14           | 17          | 13          |
| Switzerland West    | 13             | 10           | 20          | 15          |
| UAE Central         | 113            | 102          | 120         | 114         |
| UAE North           | 114            | 103          | 120         | 114         |
| UK South            | 11             | 20           | 11          | 31          |
| UK West             | 13             | 22           | 16          | 33          |
| West Central US     | 119            | 127          | 123         | 141         |
| West Europe         | 11             | 21           |             | 24          |
| West US             | 142            | 150          | 146         | 168         |
| West US 2           | 144            | 149          | 145         | 165         |
| West US 3           | 132            | 140          | 132         | 151         |

#### [Central Europe](#tab/CentralEurope/Europe)

| Source              | Germany</br>North | Germany</br>West Central | Switzerland</br>North | Switzerland</br>West | Poland</br>Central |
|---------------------|---------------|----------------------|-------------------|------------------|----------------|
| Australia Central   | 254           | 248                  | 243               | 239              | 264            |
| Australia Central 2 | 255           | 248                  | 244               | 239              | 264            |
| Australia East      | 250           | 243                  | 240               | 246              | 259            |
| Australia Southeast | 246           | 239                  | 235               | 230              | 254            |
| Brazil South        | 197           | 193                  | 201               | 194              | 206            |
| Canada Central      | 108           | 103                  | 109               | 105              | 117            |
| Canada East         | 114           | 109                  | 115               | 112              | 123            |
| Central India       | 140           | 134                  | 129               | 125              | 150            |
| Central US          | 115           | 110                  | 116               | 111              | 123            |
| East Asia           | 192           | 186                  | 181               | 176              | 201            |
| East US             | 94            | 88                   | 95                | 90               | 102            |
| East US 2           | 97            | 91                   | 97                | 94               | 106            |
| France Central      | 18            | 11                   | 16                | 13               | 27             |
| France South        | 26            | 19                   | 14                | 9                | 34             |
| Germany North       |               | 11                   | 16                | 19               | 12             |
| Germany West Central| 11            |                      | 8                 | 11               | 20             |
| Israel Central      | 68            | 53                   | 48                | 50               | 68             |
| Italy North         | 21            | 14                   | 9                 | 10               | 30             |
| Japan East          | 230           | 223                  | 219               | 214              | 239            |
| Japan West          | 239           | 232                  | 228               | 223              | 248            |
| Korea Central       | 228           | 221                  | 217               | 212              | 237            |
| Korea South         | 221           | 215                  | 210               | 205              | 230            |
| North Central US    | 109           | 104                  | 109               | 105              | 117            |
| North Europe        | 30            | 26                   | 32                | 27               | 39             |
| Norway East         | 24            | 25                   | 30                | 33               | 31             |
| Norway West         | 25            | 25                   | 30                | 33               | 34             |
| Poland Central      | 12            | 20                   | 24                | 27               |                |
| Qatar Central       | 132           | 126                  | 122               | 116              | 141            |
| South Africa North  | 169           | 162                  | 165               | 161              | 177            |
| South Africa West   | 153           | 146                  | 149               | 145              | 161            |
| South Central US    | 124           | 119                  | 125               | 119              | 133            |
| South India         | 155           | 149                  | 144               | 140              | 165            |
| Southeast Asia      | 163           | 156                  | 152               | 147              | 172            |
| Sweden Central      | 20            | 27                   | 32                | 33               | 26             |
| Switzerland North   | 16            | 9                    |                   | 7                | 24             |
| Switzerland West    | 19            | 12                   | 7                 |                  | 27             |
| UAE Central         | 124           | 117                  | 113               | 108              | 133            |
| UAE North           | 124           | 117                  | 113               | 108              | 133            |
| UK South            | 21            | 17                   | 23                | 18               | 30             |
| UK West             | 26            | 20                   | 28                | 21               | 35             |
| West Central US     | 129           | 125                  | 129               | 125              | 137            |
| West Europe         | 14            | 11                   | 17                | 19               | 24             |
| West US             | 152           | 149                  | 155               | 150              | 161            |
| West US 2           | 151           | 150                  | 158               | 147              | 160            |
| West US 3           | 142           | 136                  | 143               | 138              | 150            |


#### [Norway / Sweden](#tab/NorwaySweden/Europe)

| Source              | Norway East | Norway West | Sweden Central |
|---------------------|-------------|-------------|----------------|
| Australia Central   | 267         | 263         | 271            |
| Australia Central 2 | 267         | 263         | 272            |
| Australia East      | 263         | 258         | 267            |
| Australia Southeast | 258         | 255         | 263            |
| Brazil South        | 206         | 201         | 208            |
| Canada Central      | 115         | 109         | 119            |
| Canada East         | 121         | 118         | 125            |
| Central India       | 153         | 151         | 157            |
| Central US          | 121         | 132         | 124            |
| East Asia           | 205         | 201         | 210            |
| East US             | 100         | 97          | 103            |
| East US 2           | 106         | 101         | 110            |
| France Central      | 30          | 25          | 36             |
| France South        | 39          | 35          | 42             |
| Germany North       | 24          | 25          | 20             |
| Germany West Central| 25          | 25          | 28             |
| Israel Central      | 83          | 74          | 85             |
| Italy North         | 35          | 35          | 38             |
| Japan East          | 242         | 239         | 247            |
| Japan West          | 252         | 248         | 256            |
| Korea Central       | 240         | 237         | 245            |
| Korea South         | 234         | 230         | 238            |
| North Central US    | 115         | 120         | 121            |
| North Europe        | 39          | 33          | 42             |
| Norway East         |             | 10          | 11             |
| Norway West         | 10          |             | 17             |
| Poland Central      | 29          | 33          | 26             |
| Qatar Central       | 145         | 141         | 149            |
| South Africa North  | 181         | 175         | 186            |
| South Africa West   | 166         | 159         | 170            |
| South Central US    | 130         | 127         | 135            |
| South India         | 169         | 167         | 172            |
| Southeast Asia      | 175         | 172         | 180            |
| Sweden Central      | 10          | 17          |                |
| Switzerland North   | 30          | 30          | 32             |
| Switzerland West    | 33          | 33          | 34             |
| UAE Central         | 136         | 133         | 141            |
| UAE North           | 136         | 132         | 141            |
| UK South            | 28          | 24          | 32             |
| UK West             | 31          | 25          | 36             |
| West Central US     | 135         | 142         | 149            |
| West Europe         | 23          | 17          | 28             |
| West US             | 159         | 165         | 164            |
| West US 2           | 161         | 161         | 165            |
| West US 3           | 148         | 144         | 153            |

#### [UK / North Europe](#tab/UKNorthEurope/Europe)

| Source              | UK South | UK West | North Europe |
|---------------------|----------|---------|--------------|
| Australia Central   | 249      | 251     | 259          |
| Australia Central 2 | 249      | 251     | 260          |
| Australia East      | 258      | 260     | 252          |
| Australia Southeast | 240      | 242     | 248          |
| Brazil South        | 180      | 182     | 171          |
| Canada Central      | 92       | 94      | 86           |
| Canada East         | 98       | 100     | 95           |
| Central India       | 134      | 139     | 145          |
| Central US          | 98       | 100     | 91           |
| East Asia           | 187      | 189     | 195          |
| East US             | 77       | 79      | 68           |
| East US 2           | 82       | 84      | 73           |
| France Central      | 10       | 13      | 18           |
| France South        | 20       | 23      | 28           |
| Germany North       | 22       | 26      | 30           |
| Germany West Central| 17       | 19      | 26           |
| Israel Central      | 60       | 62      | 68           |
| Italy North         | 27       | 29      | 35           |
| Japan East          | 226      | 230     | 232          |
| Japan West          | 234      | 235     | 240          |
| Korea Central       | 222      | 224     | 230          |
| Korea South         | 216      | 217     | 224          |
| North Central US    | 94       | 96      | 87           |
| North Europe        | 13       | 16      |              |
| Norway East         | 28       | 31      | 37           |
| Norway West         | 25       | 26      | 34           |
| Poland Central      | 31       | 34      | 40           |
| Qatar Central       | 127      | 129     | 135          |
| South Africa North  | 160      | 162     | 169          |
| South Africa West   | 145      | 147     | 153          |
| South Central US    | 108      | 111     | 99           |
| South India         | 152      | 154     | 160          |
| Southeast Asia      | 157      | 159     | 165          |
| Sweden Central      | 31       | 36      | 40           |
| Switzerland North   | 24       | 28      | 33           |
| Switzerland West    | 19       | 21      | 27           |
| UAE Central         | 118      | 120     | 126          |
| UAE North           | 118      | 120     | 127          |
| UK South            |          | 8       | 13           |
| UK West             | 8        |         | 16           |
| West Central US     | 117      | 119     | 110          |
| West Europe         | 11       | 13      | 19           |
| West US             | 137      | 141     | 133          |
| West US 2           | 139      | 141     | 133          |
| West US 3           | 126      | 128     | 117          |

#### [Korea](#tab/Korea/APAC)

| Source                | Korea Central | Korea South |
|-----------------------|---------------|-------------|
| Australia Central     | 131           | 123         |
| Australia Central 2   | 131           | 123         |
| Australia East        | 130           | 129         |
| Australia Southeast   | 142           | 131         |
| Brazil South          | 299           | 301         |
| Canada Central        | 181           | 177         |
| Canada East           | 189           | 184         |
| Central India         | 119           | 111         |
| Central US            | 161           | 155         |
| East Asia             | 40            | 33          |
| East US               | 182           | 180         |
| East US 2             | 185           | 173         |
| France Central        | 217           | 210         |
| France South          | 206           | 199         |
| Germany North         | 228           | 221         |
| Germany West Central  | 221           | 214         |
| Israel Central        | 246           | 238         |
| Italy North           | 215           | 208         |
| Japan East            | 32            | 20          |
| Japan West            | 39            | 13          |
| Korea Central         |               | 9           |
| Korea South           | 10            |             |
| North Central US      | 168           | 166         |
| North Europe          | 231           | 224         |
| Norway East           | 241           | 233         |
| Norway West           | 237           | 230         |
| Poland Central        | 237           | 230         |
| Qatar Central         | 154           | 147         |
| South Africa North    | 357           | 350         |
| South Africa West     | 341           | 334         |
| South Central US      | 154           | 143         |
| South India           | 102           | 94          |
| Southeast Asia        | 70            | 62          |
| Sweden Central        | 245           | 238         |
| Switzerland North     | 217           | 210         |
| Switzerland West      | 212           | 205         |
| UAE Central           | 149           | 142         |
| UAE North             | 152           | 144         |
| UK South              | 222           | 215         |
| UK West               | 224           | 217         |
| West Central US       | 147           | 141         |
| West Europe           | 223           | 216         |
| West US               | 132           | 127         |
| West US 2             | 124           | 119         |
| West US 3             | 137           | 126         |

#### [India](#tab/India/APAC)

| Source              | Central India | West India | South India |
|---------------------|---------------|------------|-------------|
| Australia Central   | 145           | 166        | 128         |
| Australia Central 2 | 145           | 166        | 128         |
| Australia East      | 140           | 161        | 123         |
| Australia Southeast | 136           | 157        | 119         |
| Brazil South        | 310           | 331        | 324         |
| Canada Central      | 221           | 242        | 234         |
| Canada East         | 229           | 249        | 242         |
| Central India       |               | 25         | 20          |
| Central US          | 240           | 259        | 231         |
| East Asia           | 83            | 105        | 66          |
| East US             | 207           | 228        | 221         |
| East US 2           | 205           | 226        | 221         |
| France Central      | 129           | 148        | 147         |
| France South        | 118           | 139        | 133         |
| Germany North       | 140           | 162        | 156         |
| Germany West Central| 133           | 154        | 148         |
| Israel Central      | 158           | 179        | 173         |
| Italy North         | 127           | 147        | 142         |
| Japan East          | 120           | 141        | 103         |
| Japan West          | 129           | 151        | 112         |
| Korea Central       | 118           | 140        | 101         |
| Korea South         | 111           | 132        | 95          |
| North Central US    | 227           | 249        | 244         |
| North Europe        | 144           | 162        | 161         |
| Norway East         | 153           | 174        | 169         |
| Norway West         | 151           | 168        | 167         |
| Poland Central      | 149           | 174        | 165         |
| Qatar Central       | 40            | 61         | 56          |
| South Africa North  | 269           | 290        | 283         |
| South Africa West   | 253           | 272        | 268         |
| South Central US    | 230           | 252        | 235         |
| South India         | 20            | 41         |             |
| Southeast Asia      | 53            | 74         | 36          |
| Sweden Central      | 157           | 178        | 172         |
| Switzerland North   | 129           | 150        | 144         |
| Switzerland West    | 125           | 146        | 139         |
| UAE Central         | 34            | 53         | 51          |
| UAE North           | 37            | 55         | 53          |
| UK South            | 134           | 153        | 151         |
| UK West             | 138           | 155        | 152         |
| West Central US     | 235           | 255        | 218         |
| West Europe         | 137           | 154        | 153         |
| West US             | 220           | 241        | 203         |
| West US 2           | 212           | 234        | 195         |
| West US 3           | 235           | 256        | 218         |

> [!NOTE]
> Round-trip latency to West India from other Azure regions is included in the table. However, West India is not a source region so roundtrips from West India are not included in the table.]

#### [Asia](#tab/Asia/APAC)

| Source              | East Asia | Southeast Asia |
|---------------------|-----------|----------------|
| Australia Central   | 124       | 96             |
| Australia Central 2 | 124       | 95             |
| Australia East      | 120       | 90             |
| Australia Southeast | 120       | 84             |
| Brazil South        | 329       | 340            |
| Canada Central      | 201       | 222            |
| Canada East         | 208       | 229            |
| Central India       | 84        | 54             |
| Central US          | 180       | 200            |
| East Asia           |           | 36             |
| East US             | 203       | 223            |
| East US 2           | 206       | 224            |
| France Central      | 182       | 152            |
| France South        | 171       | 141            |
| Germany North       | 194       | 164            |
| Germany West Central| 186       | 156            |
| Israel Central      | 211       | 181            |
| Italy North         | 181       | 150            |
| Japan East          | 48        | 71             |
| Japan West          | 50        | 79             |
| Korea Central       | 40        | 70             |
| Korea South         | 34        | 63             |
| North Central US    | 188       | 208            |
| North Europe        | 196       | 166            |
| Norway East         | 206       | 176            |
| Norway West         | 202       | 172            |
| Poland Central      | 203       | 172            |
| Qatar Central       | 120       | 90             |
| South Africa North  | 323       | 293            |
| South Africa West   | 308       | 277            |
| South Central US    | 170       | 194            |
| South India         | 67        | 36             |
| Southeast Asia      | 36        |                |
| Sweden Central      | 211       | 180            |
| Switzerland North   | 183       | 152            |
| Switzerland West    | 178       | 147            |
| UAE Central         | 114       | 83             |
| UAE North           | 116       | 87             |
| UK South            | 188       | 157            |
| UK West             | 190       | 159            |
| West Central US     | 166       | 186            |
| West Europe         | 189       | 159            |
| West US             | 151       | 171            |
| West US 2           | 144       | 163            |
| West US 3           | 154       | 177            |

#### [UAE / Qatar / Israel](#tab/uae-qatar/MiddleEast)

| Source              | Qatar Central | UAE Central | UAE North | Israel Central |
|---------------------|---------------|-------------|-----------|----------------|
| Australia Central   | 182           | 175         | 178       | 273            |
| Australia Central 2 | 182           | 174         | 178       | 273            |
| Australia East      | 177           | 168         | 170       | 280            |
| Australia Southeast | 173           | 163         | 166       | 264            |
| Brazil South        | 302           | 293         | 294       | 234            |
| Canada Central      | 213           | 204         | 204       | 146            |
| Canada East         | 221           | 213         | 212       | 153            |
| Central India       | 41            | 34          | 38        | 158            |
| Central US          | 232           | 222         | 223       | 165            |
| East Asia           | 120           | 113         | 116       | 210            |
| East US             | 199           | 190         | 191       | 131            |
| East US 2           | 197           | 188         | 189       | 134            |
| France Central      | 122           | 112         | 114       | 55             |
| France South        | 111           | 101         | 103       | 43             |
| Germany North       | 133           | 124         | 125       | 68             |
| Germany West Central| 126           | 116         | 117       | 53             |
| Israel Central      | 151           | 141         | 142       |                |
| Italy North         | 120           | 111         | 111       | 45             |
| Japan East          | 157           | 150         | 154       | 247            |
| Japan West          | 166           | 156         | 160       | 257            |
| Korea Central       | 155           | 148         | 151       | 246            |
| Korea South         | 148           | 141         | 145       | 239            |
| North Central US    | 220           | 211         | 211       | 153            |
| North Europe        | 136           | 126         | 127       | 68             |
| Norway East         | 146           | 137         | 137       | 83             |
| Norway West         | 142           | 133         | 133       | 74             |
| Poland Central      | 143           | 133         | 133       | 68             |
| Qatar Central       |               | 12          | 14        | 150            |
| South Africa North  | 262           | 252         | 253       | 194            |
| South Africa West   | 246           | 237         | 238       | 179            |
| South Central US    | 223           | 214         | 215       | 160            |
| South India         | 57            | 50          | 53        | 173            |
| Southeast Asia      | 90            | 81          | 86        | 180            |
| Sweden Central      | 150           | 141         | 141       | 85             |
| Switzerland North   | 121           | 112         | 113       | 48             |
| Switzerland West    | 118           | 109         | 108       | 51             |
| UAE Central         | 13            |             | 6         | 141            |
| UAE North           | 15            | 6           |           | 141            |
| UK South            | 128           | 118         | 118       | 59             |
| UK West             | 129           | 120         | 121       | 61             |
| West Central US     | 246           | 236         | 237       | 177            |
| West Europe         | 128           | 119         | 120       | 61             |
| West US             | 256           | 250         | 254       | 201            |
| West US 2           | 249           | 242         | 246       | 199            |
| West US 3           | 242           | 234         | 235       | 180            |

### [South Africa](#tab/southafrica/MiddleEast)

| Source | South Africa North | South Africa West |
|--------|-------------------|------------------|
| Australia Central | 383 | 367 |
| Australia Central 2 | 383 | 367 |
| Australia East | 379 | 363 |
| Australia Southeast | 375 | 358 |
| Brazil South | 334 | 318 |
| Canada Central | 246 | 230 |
| Canada East | 254 | 237 |
| Central India | 270 | 254 |
| Central US | 265 | 248 |
| East Asia | 322 | 306 |
| East US | 232 | 215 |
| East US 2 | 234 | 218 |
| France Central | 155 | 139 |
| France South | 155 | 139 |
| Germany North | 169 | 153 |
| Germany West Central | 162 | 145 |
| Israel Central | 196 | 179 |
| Italy North | 164 | 148 |
| Japan East | 359 | 343 |
| Japan West | 369 | 352 |
| Korea Central | 357 | 341 |
| Korea South | 350 | 335 |
| North Central US | 253 | 237 |
| North Europe | 169 | 153 |
| Norway East | 182 | 165 |
| Norway West | 176 | 159 |
| Poland Central | 177 | 161 |
| Qatar Central | 262 | 245 |
| South Africa North | | 19 |
| South Africa West | 20 | |
| South Central US | 260 | 244 |
| South India | 284 | 266 |
| Southeast Asia | 292 | 276 |
| Sweden Central | 186 | 169 |
| Switzerland North | 166 | 149 |
| Switzerland West | 162 | 145 |
| UAE Central | 254 | 237 |
| UAE North | 254 | 237 |
| UK South | 160 | 144 |
| UK West | 163 | 146 |
| West Central US | 278 | 262 |
| West Europe | 161 | 145 |
| West US | 302 | 285 |
| West US 2 | 299 | 282 |
| West US 3 | 280 | 264 |

---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table" lightbox="media/azure-network-latency/azure-network-latency-thumb.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).
