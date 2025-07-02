---
title: Azure network round-trip latency statistics
description: Learn about round-trip latency statistics between Azure regions.
services: networking
author: mbender-ms
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/01/2025
ms.author: mbender
ms.custom: references_regions,updatedFY24S2
---

# Azure network round-trip latency statistics

This article provides round-trip latency statistics between Azure regions to help you optimize your cloud architecture and deployment decisions. The data comes from continuous network monitoring across Azure's global infrastructure and represents real-world performance measurements.

Use these statistics to:

- **Plan multi-region deployments** for optimal performance
- **Select regions** that minimize latency for your users
- **Design disaster recovery strategies** with latency considerations
- **Benchmark expected performance** between specific region pairs

## What is round-trip latency?

Round-trip latency is the time it takes for a data packet to travel from one point in the network to another and back again. In the context of Azure, it measures the time taken for a packet to travel between two Azure regions. This metric is crucial for applications that require low-latency communication, such as real-time data processing, gaming, and financial transactions.

## How is latency measured?

Azure measures round-trip latency using internal network probes that continuously monitor the performance of the Azure backbone network. These probes send data packets between Azure regions and record the time taken for the packets to travel to their destination and back. The measurements are collected in 1-minute intervals, providing a detailed view of network performance over time.

The latency statistics presented in this article are based on the 50th percentile (P50) of these measurements, which represents the median round-trip time. This means that half of the measured round-trip times are below this value, providing a reliable indicator of typical network performance.


## Round-trip latency data by region

The monthly Percentile P50 round trip times between Azure regions for a 30-day window are shown in the following tabs. The latency is measured in milliseconds (ms).

The current dataset was taken on *June 30th, 2025*, and it covers the 30-day period ending on *June 29th, 2025*.

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

#### [Middle East / Africa](#tab/MEA)

Latency tables for Middle East / Africa regions including UAE, South Africa, Israel, and Qatar.

Use the following tabs to view latency statistics for each region.

---

#### [West US](#tab/WestUS/Americas)


| Source | West Central US | West US | West US 2 | West US 3 |
|---|---|---|---|---|
| Australia Central | 166 | 147 | 166 | 150 |
| Australia Central 2 | 166 | 147 | 167 | 151 |
| Australia East | 161 | 141 | 162 | 147 |
| Australia Southeast | 173 | 151 | 173 | 159 |
| Brazil South | 157 | 176 | 178 | 163 |
| Canada Central | 39 | 64 | 59 | 70 |
| Canada East | 48 | 71 | 68 | 76 |
| Central India | 244 | 228 | 221 | 244 |
| Central US | 18 | 41 | 39 | 47 |
| East Asia | 173 | 159 | 151 | 163 |
| East US | 50 | 71 | 68 | 59 |
| East US 2 | 48 | 66 | 69 | 53 |
| France Central | 130 | 153 | 152 | 135 |
| France South | 130 | 153 | 150 | 137 |
| Germany North | 139 | 162 | 160 | 147 |
| Germany West Central | 136 | 159 | 158 | 142 |
| Indonesia Central | 197 | 183 | 176 | 200 |
| Israel Central | 182 | 204 | 212 | 197 |
| Italy North | 138 | 160 | 159 | 144 |
| Japan East | 121 | 107 | 100 | 113 |
| Japan West | 128 | 115 | 107 | 120 |
| Jio India West |  |  |  |  |
| Korea Central | 144 | 130 | 123 | 136 |
| Korea South | 137 | 124 | 116 | 129 |
| Malaysia West | 188 | 175 | 167 | 191 |
| Mexico Central | 44 | 52 | 73 | 40 |
| New Zealand North | 147 | 132 | 137 | 134 |
| North Central US | 27 | 51 | 47 | 58 |
| North Europe | 116 | 139 | 137 | 125 |
| Norway East | 140 | 163 | 161 | 148 |
| Norway West | 138 | 161 | 159 | 146 |
| Poland Central | 147 | 170 | 168 | 155 |
| Qatar Central | 260 | 267 | 255 | 264 |
| South Africa North | 257 | 274 | 277 | 263 |
| South Africa West | 240 | 256 | 261 | 247 |
| South Central US | 25 | 36 | 50 | 24 |
| South India | 217 | 203 | 196 | 220 |
| Southeast Asia | 184 | 171 | 163 | 187 |
| Sweden Central | 158 | 180 | 184 | 168 |
| Switzerland North | 141 | 163 | 162 | 146 |
| Switzerland West | 136 | 159 | 156 | 142 |
| UAE Central | 228 | 250 | 243 | 235 |
| UAE North | 229 | 252 | 249 | 236 |
| UK South | 125 | 147 | 145 | 133 |
| UK West | 127 | 150 | 149 | 135 |
| West Central US |  | 26 | 25 | 35 |
| West Europe | 130 | 153 | 151 | 139 |
| West US | 26 |  | 25 | 20 |
| West US 2 | 25 | 25 |  | 41 |
| West US 3 | 35 | 20 | 41 |  |

#### [Central US](#tab/CentralUS/Americas)


| Source | Central US | North Central US | South Central US |
|---|---|---|---|
| Australia Central | 178 | 188 | 167 |
| Australia Central 2 | 179 | 188 | 167 |
| Australia East | 176 | 184 | 163 |
| Australia Southeast | 188 | 197 | 176 |
| Brazil South | 151 | 138 | 141 |
| Canada Central | 28 | 17 | 50 |
| Canada East | 37 | 26 | 58 |
| Central India | 240 | 237 | 247 |
| Central US |  | 15 | 29 |
| East Asia | 187 | 197 | 179 |
| East US | 28 | 19 | 36 |
| East US 2 | 36 | 26 | 31 |
| France Central | 120 | 104 | 111 |
| France South | 116 | 101 | 117 |
| Germany North | 125 | 111 | 125 |
| Germany West Central | 124 | 110 | 119 |
| Indonesia Central | 212 | 221 | 216 |
| Israel Central | 171 | 157 | 172 |
| Italy North | 123 | 111 | 125 |
| Japan East | 136 | 145 | 129 |
| Japan West | 143 | 152 | 136 |
| Jio India West |  |  |  |
| Korea Central | 158 | 168 | 154 |
| Korea South | 152 | 162 | 145 |
| Malaysia West | 203 | 212 | 208 |
| Mexico Central | 47 | 56 | 24 |
| New Zealand North | 162 | 172 | 151 |
| North Central US | 15 |  | 41 |
| North Europe | 102 | 89 | 101 |
| Norway East | 126 | 113 | 125 |
| Norway West | 125 | 112 | 125 |
| Poland Central | 133 | 121 | 132 |
| Qatar Central | 250 | 238 | 257 |
| South Africa North | 248 | 235 | 239 |
| South Africa West | 230 | 219 | 224 |
| South Central US | 28 | 40 |  |
| South India | 232 | 219 | 236 |
| Southeast Asia | 199 | 209 | 203 |
| Sweden Central | 143 | 132 | 144 |
| Switzerland North | 127 | 114 | 126 |
| Switzerland West | 122 | 108 | 123 |
| UAE Central | 214 | 201 | 214 |
| UAE North | 216 | 202 | 215 |
| UK South | 111 | 97 | 110 |
| UK West | 112 | 99 | 114 |
| West Central US | 19 | 28 | 27 |
| West Europe | 116 | 104 | 116 |
| West US | 42 | 51 | 36 |
| West US 2 | 40 | 48 | 53 |
| West US 3 | 48 | 59 | 25 |

#### [East US](#tab/EastUS/Americas)


| Source | East US | East US 2 |
|---|---|---|
| Australia Central | 202 | 197 |
| Australia Central 2 | 202 | 198 |
| Australia East | 199 | 193 |
| Australia Southeast | 212 | 207 |
| Brazil South | 119 | 118 |
| Canada Central | 21 | 23 |
| Canada East | 34 | 38 |
| Central India | 235 | 234 |
| Central US | 29 | 37 |
| East Asia | 216 | 216 |
| East US |  | 10 |
| East US 2 | 10 |  |
| France Central | 88 | 85 |
| France South | 84 | 89 |
| Germany North | 95 | 98 |
| Germany West Central | 94 | 92 |
| Indonesia Central | 238 | 243 |
| Israel Central | 139 | 135 |
| Italy North | 93 | 97 |
| Japan East | 164 | 166 |
| Japan West | 172 | 171 |
| Jio India West |  |  |
| Korea Central | 187 | 192 |
| Korea South | 180 | 180 |
| Malaysia West | 228 | 235 |
| Mexico Central | 55 | 50 |
| New Zealand North | 185 | 182 |
| North Central US | 20 | 26 |
| North Europe | 74 | 77 |
| Norway East | 97 | 101 |
| Norway West | 93 | 98 |
| Poland Central | 102 | 106 |
| Qatar Central | 215 | 215 |
| South Africa North | 218 | 213 |
| South Africa West | 202 | 198 |
| South Central US | 36 | 32 |
| South India | 200 | 204 |
| Southeast Asia | 224 | 231 |
| Sweden Central | 113 | 114 |
| Switzerland North | 96 | 100 |
| Switzerland West | 91 | 96 |
| UAE Central | 183 | 188 |
| UAE North | 184 | 189 |
| UK South | 79 | 83 |
| UK West | 81 | 85 |
| West Central US | 54 | 49 |
| West Europe | 85 | 90 |
| West US | 73 | 68 |
| West US 2 | 69 | 70 |
| West US 3 | 60 | 54 |

#### [Canada](#tab/Canada/Americas)


| Source | Canada Central | Canada East |
|---|---|---|
| Australia Central | 203 | 211 |
| Australia Central 2 | 204 | 212 |
| Australia East | 201 | 208 |
| Australia Southeast | 213 | 221 |
| Brazil South | 131 | 134 |
| Canada Central |  | 14 |
| Canada East | 15 |  |
| Central India | 244 | 244 |
| Central US | 27 | 36 |
| East Asia | 211 | 219 |
| East US | 20 | 32 |
| East US 2 | 23 | 36 |
| France Central | 100 | 103 |
| France South | 96 | 100 |
| Germany North | 107 | 110 |
| Germany West Central | 106 | 109 |
| Indonesia Central | 235 | 243 |
| Israel Central | 154 | 155 |
| Italy North | 105 | 109 |
| Japan East | 159 | 167 |
| Japan West | 166 | 174 |
| Jio India West |  |  |
| Korea Central | 181 | 189 |
| Korea South | 175 | 183 |
| Malaysia West | 227 | 234 |
| Mexico Central | 72 | 82 |
| New Zealand North | 187 | 195 |
| North Central US | 18 | 26 |
| North Europe | 85 | 87 |
| Norway East | 109 | 111 |
| Norway West | 105 | 109 |
| Poland Central | 115 | 118 |
| Qatar Central | 230 | 233 |
| South Africa North | 231 | 240 |
| South Africa West | 216 | 224 |
| South Central US | 51 | 59 |
| South India | 212 | 215 |
| Southeast Asia | 222 | 230 |
| Sweden Central | 126 | 127 |
| Switzerland North | 108 | 111 |
| Switzerland West | 103 | 106 |
| UAE Central | 195 | 198 |
| UAE North | 196 | 200 |
| UK South | 92 | 96 |
| UK West | 93 | 97 |
| West Central US | 40 | 48 |
| West Europe | 98 | 101 |
| West US | 65 | 70 |
| West US 2 | 60 | 68 |
| West US 3 | 73 | 79 |

#### [South America](#tab/SouthAmerica/Americas)


| Source | Brazil South | Mexico Central |
|---|---|---|
| Australia Central | 302 | 183 |
| Australia Central 2 | 303 | 183 |
| Australia East | 299 | 180 |
| Australia Southeast | 311 | 192 |
| Brazil South |  | 157 |
| Canada Central | 130 | 72 |
| Canada East | 135 | 83 |
| Central India | 329 | 256 |
| Central US | 150 | 47 |
| East Asia | 320 | 200 |
| East US | 117 | 54 |
| East US 2 | 116 | 49 |
| France Central | 190 | 129 |
| France South | 186 | 132 |
| Germany North | 194 | 142 |
| Germany West Central | 195 | 138 |
| Indonesia Central | 343 | 234 |
| Israel Central | 239 | 191 |
| Italy North | 194 | 140 |
| Japan East | 270 | 149 |
| Japan West | 277 | 157 |
| Jio India West |  | 282 |
| Korea Central | 294 | 171 |
| Korea South | 286 | 164 |
| Malaysia West | 336 | 225 |
| Mexico Central | 156 |  |
| New Zealand North | 286 | 169 |
| North Central US | 138 | 56 |
| North Europe | 171 | 118 |
| Norway East | 196 | 143 |
| Norway West | 193 | 141 |
| Poland Central | 202 | 150 |
| Qatar Central | 317 | 273 |
| South Africa North | 319 | 258 |
| South Africa West | 303 | 242 |
| South Central US | 139 | 24 |
| South India | 300 | 253 |
| Southeast Asia | 332 | 221 |
| Sweden Central | 217 | 165 |
| Switzerland North | 196 | 143 |
| Switzerland West | 192 | 139 |
| UAE Central | 283 | 229 |
| UAE North | 284 | 231 |
| UK South | 180 | 128 |
| UK West | 183 | 132 |
| West Central US | 156 | 45 |
| West Europe | 186 | 133 |
| West US | 176 | 53 |
| West US 2 | 177 | 74 |
| West US 3 | 163 | 41 |

#### [Western Europe](#tab/WesternEurope/Europe)


| Source | France Central | France South | Switzerland North | Switzerland West | West Europe |
|---|---|---|---|---|---|
| Australia Central | 245 | 234 | 245 | 241 | 254 |
| Australia Central 2 | 245 | 234 | 245 | 241 | 254 |
| Australia East | 241 | 230 | 242 | 237 | 250 |
| Australia Southeast | 236 | 225 | 236 | 231 | 244 |
| Brazil South | 190 | 186 | 197 | 192 | 186 |
| Canada Central | 99 | 96 | 107 | 102 | 97 |
| Canada East | 104 | 100 | 111 | 107 | 101 |
| Central India | 123 | 122 | 134 | 132 | 145 |
| Central US | 118 | 115 | 125 | 119 | 115 |
| East Asia | 182 | 170 | 182 | 177 | 190 |
| East US | 86 | 83 | 94 | 89 | 83 |
| East US 2 | 84 | 87 | 98 | 94 | 88 |
| France Central |  | 15 | 17 | 13 | 13 |
| France South | 15 |  | 14 | 10 | 23 |
| Germany North | 19 | 27 | 16 | 19 | 15 |
| Germany West Central | 12 | 19 | 9 | 12 | 12 |
| Indonesia Central | 165 | 154 | 165 | 160 | 173 |
| Israel Central | 52 | 41 | 51 | 53 | 66 |
| Italy North | 21 | 12 | 9 | 10 | 23 |
| Japan East | 214 | 202 | 213 | 209 | 234 |
| Japan West | 216 | 205 | 216 | 211 | 224 |
| Jio India West |  |  |  |  |  |
| Korea Central | 213 | 201 | 212 | 208 | 220 |
| Korea South | 207 | 195 | 207 | 202 | 215 |
| Malaysia West | 154 | 143 | 156 | 150 | 164 |
| Mexico Central | 128 | 131 | 142 | 137 | 132 |
| New Zealand North | 262 | 256 | 269 | 265 | 267 |
| North Central US | 104 | 101 | 112 | 107 | 102 |
| North Europe | 20 | 29 | 31 | 35 | 18 |
| Norway East | 31 | 38 | 28 | 31 | 23 |
| Norway West | 27 | 36 | 31 | 35 | 19 |
| Poland Central | 29 | 36 | 26 | 29 | 22 |
| Qatar Central | 141 | 116 | 131 | 124 | 147 |
| South Africa North | 156 | 154 | 164 | 160 | 164 |
| South Africa West | 140 | 138 | 148 | 144 | 148 |
| South Central US | 110 | 114 | 125 | 120 | 114 |
| South India | 130 | 118 | 129 | 125 | 138 |
| Southeast Asia | 148 | 138 | 152 | 147 | 160 |
| Sweden Central | 41 | 49 | 43 | 47 | 36 |
| Switzerland North | 17 | 14 |  | 7 | 18 |
| Switzerland West | 14 | 10 | 7 |  | 21 |
| UAE Central | 113 | 101 | 113 | 108 | 121 |
| UAE North | 114 | 102 | 114 | 109 | 122 |
| UK South | 11 | 20 | 23 | 19 | 12 |
| UK West | 15 | 25 | 28 | 24 | 15 |
| West Central US | 131 | 130 | 140 | 136 | 129 |
| West Europe | 15 | 24 | 19 | 22 |  |
| West US | 153 | 152 | 163 | 159 | 153 |
| West US 2 | 153 | 146 | 160 | 156 | 150 |
| West US 3 | 135 | 138 | 147 | 142 | 138 |

#### [Central Europe](#tab/CentralEurope/Europe)


| Source | Germany North | Germany West Central | Italy North | Poland Central |
|---|---|---|---|---|
| Australia Central | 257 | 251 | 243 | 266 |
| Australia Central 2 | 257 | 251 | 243 | 266 |
| Australia East | 254 | 247 | 239 | 263 |
| Australia Southeast | 248 | 241 | 233 | 257 |
| Brazil South | 194 | 195 | 194 | 202 |
| Canada Central | 106 | 106 | 105 | 114 |
| Canada East | 110 | 110 | 109 | 118 |
| Central India | 136 | 131 | 132 | 156 |
| Central US | 124 | 124 | 123 | 133 |
| East Asia | 193 | 187 | 179 | 202 |
| East US | 92 | 93 | 92 | 101 |
| East US 2 | 96 | 90 | 95 | 104 |
| France Central | 18 | 12 | 21 | 29 |
| France South | 26 | 20 | 12 | 37 |
| Germany North |  | 11 | 22 | 16 |
| Germany West Central | 10 |  | 14 | 22 |
| Indonesia Central | 177 | 170 | 162 |  |
| Israel Central | 63 | 57 | 49 | 72 |
| Italy North | 20 | 14 |  | 31 |
| Japan East | 239 | 219 | 211 | 249 |
| Japan West | 228 | 221 | 213 | 237 |
| Jio India West |  |  | 150 | 166 |
| Korea Central | 224 | 218 | 210 | 233 |
| Korea South | 219 | 212 | 204 | 227 |
| Malaysia West | 168 | 162 | 154 |  |
| Mexico Central | 140 | 137 | 139 | 148 |
| New Zealand North | 276 | 271 | 266 |  |
| North Central US | 110 | 110 | 111 | 119 |
| North Europe | 27 | 26 | 36 | 35 |
| Norway East | 20 | 23 | 34 | 28 |
| Norway West | 26 | 26 | 36 | 34 |
| Poland Central | 16 | 22 | 32 |  |
| Qatar Central | 149 | 142 | 121 | 158 |
| South Africa North | 169 | 162 | 162 | 178 |
| South Africa West | 153 | 146 | 146 | 162 |
| South Central US | 122 | 118 | 123 | 131 |
| South India | 141 | 135 | 127 | 150 |
| Southeast Asia | 164 | 157 | 149 | 173 |
| Sweden Central | 32 | 34 | 49 | 31 |
| Switzerland North | 16 | 9 | 9 | 26 |
| Switzerland West | 19 | 13 | 11 | 30 |
| UAE Central | 124 | 118 | 110 | 133 |
| UAE North | 126 | 119 | 111 | 134 |
| UK South | 21 | 17 | 28 | 29 |
| UK West | 22 | 22 | 32 | 31 |
| West Central US | 138 | 136 | 138 | 147 |
| West Europe | 14 | 13 | 24 | 23 |
| West US | 161 | 159 | 161 | 170 |
| West US 2 | 159 | 159 | 159 | 168 |
| West US 3 | 147 | 142 | 146 | 154 |

#### [Nordic Countries](#tab/Nordic/Europe)


| Source | Norway East | Norway West | Sweden Central |
|---|---|---|---|
| Australia Central | 270 | 267 | 293 |
| Australia Central 2 | 270 | 267 | 294 |
| Australia East | 266 | 263 | 294 |
| Australia Southeast | 260 | 257 | 281 |
| Brazil South | 196 | 193 | 215 |
| Canada Central | 108 | 104 | 126 |
| Canada East | 112 | 109 | 126 |
| Central India | 160 | 158 | 202 |
| Central US | 126 | 124 | 142 |
| East Asia | 206 | 203 | 225 |
| East US | 95 | 91 | 111 |
| East US 2 | 99 | 95 | 113 |
| France Central | 30 | 27 | 40 |
| France South | 38 | 36 | 48 |
| Germany North | 20 | 26 | 31 |
| Germany West Central | 22 | 25 | 34 |
| Indonesia Central | 189 | 186 |  |
| Israel Central | 83 | 78 | 94 |
| Italy North | 33 | 35 | 48 |
| Japan East | 247 | 234 | 277 |
| Japan West | 240 | 237 | 263 |
| Jio India West |  |  |  |
| Korea Central | 236 | 233 | 273 |
| Korea South | 231 | 228 | 260 |
| Malaysia West | 180 | 177 |  |
| Mexico Central | 142 | 139 | 164 |
| New Zealand North | 278 | 286 |  |
| North Central US | 112 | 111 | 130 |
| North Europe | 28 | 26 | 38 |
| Norway East |  | 10 | 17 |
| Norway West | 10 |  | 20 |
| Poland Central | 28 | 34 | 29 |
| Qatar Central | 157 | 160 | 173 |
| South Africa North | 181 | 177 | 197 |
| South Africa West | 165 | 161 | 180 |
| South Central US | 124 | 122 | 143 |
| South India | 153 | 151 | 188 |
| Southeast Asia | 176 | 173 | 201 |
| Sweden Central | 16 | 21 |  |
| Switzerland North | 28 | 31 | 43 |
| Switzerland West | 31 | 34 | 46 |
| UAE Central | 136 | 134 | 155 |
| UAE North | 138 | 135 | 168 |
| UK South | 24 | 17 | 37 |
| UK West | 28 | 22 | 40 |
| West Central US | 140 | 138 | 157 |
| West Europe | 23 | 20 | 36 |
| West US | 163 | 160 | 179 |
| West US 2 | 161 | 158 | 184 |
| West US 3 | 148 | 145 | 168 |

#### [UK / Northern Europe](#tab/NorthernEurope/Europe)


| Source | North Europe | UK South | UK West |
|---|---|---|---|
| Australia Central | 260 | 251 | 256 |
| Australia Central 2 | 260 | 251 | 256 |
| Australia East | 256 | 247 | 253 |
| Australia Southeast | 250 | 241 | 247 |
| Brazil South | 172 | 180 | 184 |
| Canada Central | 85 | 91 | 92 |
| Canada East | 87 | 96 | 97 |
| Central India | 139 | 129 | 142 |
| Central US | 102 | 111 | 112 |
| East Asia | 196 | 187 | 192 |
| East US | 70 | 78 | 80 |
| East US 2 | 76 | 81 | 84 |
| France Central | 19 | 11 | 15 |
| France South | 29 | 20 | 25 |
| Germany North | 27 | 21 | 23 |
| Germany West Central | 26 | 17 | 22 |
| Indonesia Central | 179 | 171 | 176 |
| Israel Central | 78 | 210 | 211 |
| Italy North | 35 | 27 | 32 |
| Japan East | 232 | 230 | 234 |
| Japan West | 239 | 222 | 227 |
| Jio India West |  |  |  |
| Korea Central | 227 | 218 | 223 |
| Korea South | 221 | 212 | 218 |
| Malaysia West | 170 | 159 | 165 |
| Mexico Central | 117 | 127 | 131 |
| New Zealand North | 251 | 262 | 263 |
| North Central US | 89 | 96 | 100 |
| North Europe |  | 13 | 17 |
| Norway East | 28 | 24 | 28 |
| Norway West | 26 | 17 | 22 |
| Poland Central | 35 | 29 | 31 |
| Qatar Central | 136 | 146 | 152 |
| South Africa North | 170 | 161 | 163 |
| South Africa West | 154 | 145 | 147 |
| South Central US | 100 | 108 | 113 |
| South India | 144 | 135 | 137 |
| Southeast Asia | 166 | 155 | 161 |
| Sweden Central | 34 | 38 | 41 |
| Switzerland North | 31 | 23 | 28 |
| Switzerland West | 35 | 19 | 24 |
| UAE Central | 127 | 118 | 123 |
| UAE North | 128 | 119 | 125 |
| UK South | 13 |  | 7 |
| UK West | 16 | 7 |  |
| West Central US | 116 | 125 | 127 |
| West Europe | 18 | 12 | 15 |
| West US | 138 | 147 | 150 |
| West US 2 | 137 | 145 | 148 |
| West US 3 | 124 | 133 | 134 |

#### [Australia / New Zealand](#tab/AusNz/APAC)


| Source | Australia Central | Australia Central 2 | Australia East | Australia Southeast | New Zealand North |
|---|---|---|---|---|---|
| Australia Central |  | 3 | 8 | 16 | 32 |
| Australia Central 2 | 4 |  | 8 | 13 | 32 |
| Australia East | 8 | 8 |  | 16 | 28 |
| Australia Southeast | 16 | 12 | 16 |  | 40 |
| Brazil South | 302 | 302 | 298 | 311 | 288 |
| Canada Central | 202 | 203 | 201 | 212 | 187 |
| Canada East | 212 | 212 | 210 | 221 | 196 |
| Central India | 153 | 154 | 153 | 145 | 191 |
| Central US | 177 | 177 | 175 | 187 | 162 |
| East Asia | 122 | 122 | 122 | 118 | 142 |
| East US | 200 | 200 | 198 | 211 | 183 |
| East US 2 | 195 | 195 | 193 | 204 | 181 |
| France Central | 244 | 245 | 241 | 236 | 262 |
| France South | 234 | 234 | 230 | 225 | 258 |
| Germany North | 258 | 257 | 254 | 248 | 276 |
| Germany West Central | 250 | 250 | 247 | 241 | 272 |
| Indonesia Central | 110 | 110 | 107 | 100 | 131 |
| Israel Central | 291 | 306 | 288 | 291 | 314 |
| Italy North | 242 | 242 | 239 | 233 | 266 |
| Japan East | 107 | 107 | 103 | 114 | 127 |
| Japan West | 114 | 114 | 110 | 120 | 135 |
| Jio India West |  |  |  |  | 212 |
| Korea Central | 129 | 129 | 126 | 138 | 150 |
| Korea South | 123 | 123 | 119 | 130 | 144 |
| Malaysia West | 102 | 101 | 99 | 92 | 122 |
| Mexico Central | 182 | 182 | 179 | 191 | 169 |
| New Zealand North | 31 | 31 | 28 | 40 |  |
| North Central US | 187 | 187 | 184 | 196 | 172 |
| North Europe | 259 | 259 | 256 | 250 | 248 |
| Norway East | 269 | 269 | 266 | 260 | 278 |
| Norway West | 267 | 266 | 263 | 257 | 286 |
| Poland Central | 266 | 266 | 263 | 257 | 285 |
| Qatar Central | 186 | 184 | 184 | 175 | 227 |
| South Africa North | 273 | 272 | 269 | 263 | 293 |
| South Africa West | 292 | 292 | 289 | 283 | 312 |
| South Central US | 165 | 165 | 162 | 174 | 150 |
| South India | 131 | 130 | 127 | 121 | 151 |
| Southeast Asia | 97 | 97 | 94 | 88 | 118 |
| Sweden Central | 294 | 295 | 297 | 282 | 310 |
| Switzerland North | 245 | 245 | 241 | 236 | 269 |
| Switzerland West | 241 | 240 | 237 | 231 | 264 |
| UAE Central | 172 | 172 | 169 | 163 | 193 |
| UAE North | 175 | 175 | 172 | 166 | 195 |
| UK South | 251 | 250 | 247 | 241 | 263 |
| UK West | 256 | 255 | 252 | 246 | 263 |
| West Central US | 165 | 166 | 162 | 172 | 148 |
| West Europe | 254 | 254 | 251 | 245 | 267 |
| West US | 146 | 146 | 140 | 150 | 133 |
| West US 2 | 166 | 166 | 161 | 172 | 137 |
| West US 3 | 150 | 150 | 147 | 159 | 133 |

#### [Japan](#tab/Japan/APAC)


| Source | Japan East | Japan West |
|---|---|---|
| Australia Central | 107 | 115 |
| Australia Central 2 | 108 | 115 |
| Australia East | 104 | 111 |
| Australia Southeast | 114 | 121 |
| Brazil South | 271 | 278 |
| Canada Central | 159 | 166 |
| Canada East | 168 | 175 |
| Central India | 128 | 128 |
| Central US | 135 | 143 |
| East Asia | 53 | 50 |
| East US | 163 | 171 |
| East US 2 | 167 | 171 |
| France Central | 214 | 217 |
| France South | 203 | 206 |
| Germany North | 240 | 229 |
| Germany West Central | 219 | 222 |
| Indonesia Central | 85 | 82 |
| Israel Central | 257 | 259 |
| Italy North | 211 | 214 |
| Japan East |  | 12 |
| Japan West | 12 |  |
| Jio India West |  |  |
| Korea Central | 29 | 19 |
| Korea South | 21 | 14 |
| Malaysia West | 77 | 73 |
| Mexico Central | 148 | 156 |
| New Zealand North | 127 | 134 |
| North Central US | 145 | 152 |
| North Europe | 233 | 240 |
| Norway East | 248 | 241 |
| Norway West | 235 | 238 |
| Poland Central | 249 | 238 |
| Qatar Central | 163 | 161 |
| South Africa North | 249 | 245 |
| South Africa West | 269 | 264 |
| South Central US | 129 | 136 |
| South India | 106 | 102 |
| Southeast Asia | 73 | 69 |
| Sweden Central | 278 | 261 |
| Switzerland North | 214 | 217 |
| Switzerland West | 209 | 212 |
| UAE Central | 148 | 144 |
| UAE North | 152 | 147 |
| UK South | 231 | 222 |
| UK West | 234 | 227 |
| West Central US | 121 | 129 |
| West Europe | 235 | 226 |
| West US | 108 | 115 |
| West US 2 | 100 | 108 |
| West US 3 | 113 | 120 |

#### [Korea](#tab/Korea/APAC)


| Source | Korea Central | Korea South |
|---|---|---|
| Australia Central | 129 | 123 |
| Australia Central 2 | 129 | 123 |
| Australia East | 126 | 119 |
| Australia Southeast | 138 | 130 |
| Brazil South | 294 | 286 |
| Canada Central | 181 | 175 |
| Canada East | 190 | 183 |
| Central India | 126 | 122 |
| Central US | 157 | 152 |
| East Asia | 41 | 33 |
| East US | 185 | 179 |
| East US 2 | 189 | 178 |
| France Central | 212 | 207 |
| France South | 201 | 196 |
| Germany North | 225 | 219 |
| Germany West Central | 217 | 212 |
| Indonesia Central | 77 | 72 |
| Israel Central | 269 | 266 |
| Italy North | 209 | 204 |
| Japan East | 29 | 20 |
| Japan West | 18 | 13 |
| Jio India West |  |  |
| Korea Central |  | 8 |
| Korea South | 8 |  |
| Malaysia West | 69 | 64 |
| Mexico Central | 170 | 162 |
| New Zealand North | 150 | 143 |
| North Central US | 167 | 161 |
| North Europe | 227 | 221 |
| Norway East | 236 | 231 |
| Norway West | 234 | 228 |
| Poland Central | 233 | 228 |
| Qatar Central | 160 | 156 |
| South Africa North | 240 | 234 |
| South Africa West | 259 | 254 |
| South Central US | 153 | 144 |
| South India | 98 | 92 |
| Southeast Asia | 65 | 59 |
| Sweden Central | 270 | 259 |
| Switzerland North | 212 | 207 |
| Switzerland West | 208 | 202 |
| UAE Central | 139 | 134 |
| UAE North | 142 | 137 |
| UK South | 218 | 213 |
| UK West | 223 | 218 |
| West Central US | 144 | 137 |
| West Europe | 221 | 216 |
| West US | 130 | 124 |
| West US 2 | 123 | 116 |
| West US 3 | 136 | 128 |

#### [India](#tab/India/APAC)


| Source | Central India | Jio India West | South India | West India |
|---|---|---|---|---|
| Australia Central | 152 |  | 131 | 144 |
| Australia Central 2 | 154 |  | 130 | 144 |
| Australia East | 152 |  | 127 | 140 |
| Australia Southeast | 144 |  | 121 | 134 |
| Brazil South | 331 |  | 300 | 283 |
| Canada Central | 244 |  | 211 | 194 |
| Canada East | 245 |  | 215 | 198 |
| Central India |  |  | 22 | 5 |
| Central US | 239 |  | 231 | 214 |
| East Asia | 90 |  | 66 | 80 |
| East US | 234 |  | 198 | 181 |
| East US 2 | 233 |  | 202 | 185 |
| France Central | 123 |  | 130 | 113 |
| France South | 122 |  | 118 | 102 |
| Germany North | 142 |  | 141 | 125 |
| Germany West Central | 130 |  | 134 | 117 |
| Indonesia Central | 68 | 87 | 50 |  |
| Israel Central | 179 |  | 176 | 151 |
| Italy North | 131 |  | 127 | 110 |
| Japan East | 126 |  | 106 | 119 |
| Japan West | 127 |  | 101 | 114 |
| Jio India West |  |  |  |  |
| Korea Central | 123 |  | 97 | 111 |
| Korea South | 123 |  | 92 | 105 |
| Malaysia West | 58 | 76 | 35 |  |
| Mexico Central | 255 |  | 252 | 229 |
| New Zealand North | 192 | 211 | 150 |  |
| North Central US | 237 |  | 218 | 201 |
| North Europe | 139 |  | 144 | 127 |
| Norway East | 159 |  | 153 | 136 |
| Norway West | 158 |  | 151 | 135 |
| Poland Central | 153 |  | 150 | 133 |
| Qatar Central | 47 |  | 56 | 36 |
| South Africa North | 205 |  | 146 | 129 |
| South Africa West | 223 |  | 166 | 149 |
| South Central US | 246 |  | 235 | 212 |
| South India | 23 |  |  | 17 |
| Southeast Asia | 56 |  | 37 | 50 |
| Sweden Central | 204 |  | 187 | 168 |
| Switzerland North | 133 |  | 129 | 112 |
| Switzerland West | 130 |  | 125 | 108 |
| UAE Central | 41 |  | 45 | 29 |
| UAE North | 39 |  | 48 | 32 |
| UK South | 129 |  | 135 | 118 |
| UK West | 142 |  | 137 | 120 |
| West Central US | 243 |  | 217 | 229 |
| West Europe | 146 |  | 139 | 122 |
| West US | 227 |  | 203 | 216 |
| West US 2 | 220 |  | 196 | 209 |
| West US 3 | 243 |  | 219 | 232 |

#### [Asia](#tab/Asia/APAC)


| Source | East Asia | Malaysia West | Southeast Asia |
|---|---|---|---|
| Australia Central | 122 | 102 | 98 |
| Australia Central 2 | 123 | 102 | 98 |
| Australia East | 123 | 99 | 94 |
| Australia Southeast | 119 | 92 | 88 |
| Brazil South | 321 | 337 | 332 |
| Canada Central | 211 | 226 | 222 |
| Canada East | 220 | 235 | 231 |
| Central India | 89 | 57 | 56 |
| Central US | 187 | 202 | 198 |
| East Asia |  | 35 | 36 |
| East US | 214 | 226 | 222 |
| East US 2 | 215 | 236 | 228 |
| France Central | 182 | 153 | 148 |
| France South | 171 | 143 | 139 |
| Germany North | 194 | 169 | 165 |
| Germany West Central | 187 | 161 | 157 |
| Indonesia Central | 49 | 21 | 17 |
| Israel Central | 224 | 207 | 184 |
| Italy North | 179 | 153 | 149 |
| Japan East | 53 | 76 | 73 |
| Japan West | 49 | 73 | 69 |
| Jio India West |  | 76 |  |
| Korea Central | 41 | 69 | 65 |
| Korea South | 33 | 64 | 59 |
| Malaysia West | 35 |  | 9 |
| Mexico Central | 199 | 224 | 220 |
| New Zealand North | 142 | 122 | 118 |
| North Central US | 197 | 213 | 208 |
| North Europe | 196 | 170 | 166 |
| Norway East | 206 | 180 | 176 |
| Norway West | 203 | 178 | 174 |
| Poland Central | 202 | 177 | 173 |
| Qatar Central | 123 | 89 | 94 |
| South Africa North | 209 | 178 | 180 |
| South Africa West | 229 | 197 | 199 |
| South Central US | 178 | 207 | 202 |
| South India | 67 | 35 | 38 |
| Southeast Asia | 36 | 9 |  |
| Sweden Central | 223 | 204 | 202 |
| Switzerland North | 182 | 156 | 152 |
| Switzerland West | 177 | 150 | 147 |
| UAE Central | 109 | 77 | 79 |
| UAE North | 112 | 80 | 82 |
| UK South | 187 | 159 | 155 |
| UK West | 192 | 165 | 161 |
| West Central US | 173 | 189 | 184 |
| West Europe | 191 | 164 | 161 |
| West US | 159 | 175 | 171 |
| West US 2 | 152 | 168 | 163 |
| West US 3 | 163 | 190 | 187 |

#### [Middle East](#tab/MiddleEast/MEA)


| Source | Israel Central | Qatar Central | UAE Central | UAE North |
|---|---|---|---|---|
| Australia Central | 293 | 186 | 173 | 176 |
| Australia Central 2 | 306 | 185 | 173 | 176 |
| Australia East | 289 | 184 | 169 | 172 |
| Australia Southeast | 291 | 176 | 163 | 166 |
| Brazil South | 239 | 319 | 283 | 285 |
| Canada Central | 153 | 229 | 195 | 195 |
| Canada East | 157 | 233 | 198 | 200 |
| Central India | 181 | 46 | 41 | 40 |
| Central US | 170 | 249 | 213 | 215 |
| East Asia | 224 | 123 | 108 | 111 |
| East US | 137 | 212 | 182 | 183 |
| East US 2 | 133 | 214 | 187 | 187 |
| France Central | 53 | 141 | 112 | 114 |
| France South | 41 | 117 | 102 | 103 |
| Germany North | 64 | 150 | 125 | 126 |
| Germany West Central | 57 | 143 | 118 | 119 |
| Indonesia Central | 199 |  | 92 | 95 |
| Israel Central |  | 154 | 143 | 151 |
| Italy North | 49 | 121 | 110 | 111 |
| Japan East | 257 | 163 | 148 | 151 |
| Japan West | 258 | 160 | 143 | 146 |
| Jio India West | 200 |  |  |  |
| Korea Central | 269 | 160 | 139 | 142 |
| Korea South | 267 | 156 | 134 | 137 |
| Malaysia West | 207 |  | 77 | 80 |
| Mexico Central | 190 | 270 | 228 | 230 |
| New Zealand North | 316 |  | 192 | 195 |
| North Central US | 156 | 237 | 200 | 202 |
| North Europe | 78 | 136 | 127 | 128 |
| Norway East | 83 | 159 | 137 | 138 |
| Norway West | 79 | 161 | 134 | 135 |
| Poland Central | 73 | 158 | 133 | 135 |
| Qatar Central | 154 |  | 16 | 20 |
| South Africa North | 198 | 190 | 105 | 102 |
| South Africa West | 182 | 210 | 124 | 122 |
| South Central US | 170 | 255 | 212 | 214 |
| South India | 177 | 57 | 46 | 49 |
| Southeast Asia | 184 | 94 | 79 | 82 |
| Sweden Central | 95 | 175 | 154 | 167 |
| Switzerland North | 51 | 135 | 112 | 114 |
| Switzerland West | 54 | 124 | 108 | 109 |
| UAE Central | 143 | 16 |  | 6 |
| UAE North | 151 | 20 | 6 |  |
| UK South | 210 | 148 | 118 | 120 |
| UK West | 212 | 152 | 123 | 125 |
| West Central US | 182 | 261 | 229 | 230 |
| West Europe | 67 | 148 | 122 | 123 |
| West US | 204 | 267 | 250 | 252 |
| West US 2 | 208 | 254 | 244 | 249 |
| West US 3 | 199 | 264 | 235 | 236 |

#### [Africa](#tab/Africa/MEA)


| Source | South Africa North | South Africa West |
|---|---|---|
| Australia Central | 273 | 293 |
| Australia Central 2 | 273 | 293 |
| Australia East | 270 | 289 |
| Australia Southeast | 264 | 283 |
| Brazil South | 319 | 303 |
| Canada Central | 231 | 215 |
| Canada East | 241 | 224 |
| Central India | 205 | 223 |
| Central US | 245 | 229 |
| East Asia | 209 | 229 |
| East US | 217 | 200 |
| East US 2 | 212 | 196 |
| France Central | 156 | 140 |
| France South | 154 | 138 |
| Germany North | 170 | 153 |
| Germany West Central | 162 | 146 |
| Indonesia Central | 193 | 211 |
| Israel Central | 198 | 187 |
| Italy North | 162 | 146 |
| Japan East | 249 | 268 |
| Japan West | 244 | 263 |
| Jio India West |  |  |
| Korea Central | 240 | 259 |
| Korea South | 235 | 254 |
| Malaysia West | 178 | 197 |
| Mexico Central | 257 | 240 |
| New Zealand North | 293 | 312 |
| North Central US | 234 | 218 |
| North Europe | 170 | 153 |
| Norway East | 182 | 165 |
| Norway West | 178 | 161 |
| Poland Central | 178 | 162 |
| Qatar Central | 190 | 210 |
| South Africa North |  | 20 |
| South Africa West | 21 |  |
| South Central US | 239 | 222 |
| South India | 147 | 166 |
| Southeast Asia | 180 | 199 |
| Sweden Central | 199 | 180 |
| Switzerland North | 165 | 148 |
| Switzerland West | 161 | 144 |
| UAE Central | 105 | 124 |
| UAE North | 103 | 121 |
| UK South | 161 | 145 |
| UK West | 163 | 147 |
| West Central US | 257 | 240 |
| West Europe | 165 | 149 |
| West US | 273 | 255 |
| West US 2 | 278 | 261 |
| West US 3 | 263 | 247 |


---

Additionally, you can view all of the data in a single table.

:::image type="content" source="media/azure-network-latency/azure-network-latency.png" alt-text="Screenshot of full region latency table" lightbox="media/azure-network-latency/azure-network-latency-thumb.png":::

## Next steps

Learn about [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).