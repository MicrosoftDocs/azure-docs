---
title: Microsoft Sentinel graph provider reference
description: Reference documentation for the Microsoft Sentinel Graph Builder API for building and querying security graphs.
author: EdB-MSFT
ms.author: edbaynash
ms.topic: reference
ms.date: 03/23/2026
ms.service: microsoft-sentinel
ms.subservice: sentinel-platform

#Customer intent: As a security analyst or engineer, I want to use the Graph Builder API to create and query security graphs so that I can perform advanced threat analysis and investigation.

---

# Graph Builder API Reference (preview)

The sentinel_graph class provides a way to interact with the Microsoft Sentinel graph, allowing you to define your graph schema, transform data from the Microsoft Sentinel data lake into nodes and edges, publish a graph, query graph, and run advanced graph algorithms. This class is designed to work with the Spark sessions in Jupyter notebooks running on Microsoft Sentinel spark compute.


## GraphSpecBuilder

The GraphSpecBuilder class provides a fluent builder for creating graph specifications with data pipelines and schema integration.

> [!IMPORTANT] 
> The `GraphBuilder` alias for this class is deprecated and will be removed in a future version. Use `GraphSpecBuilder` in all new code.
>
> ```python
> # Deprecated — emits DeprecationWarning
> from sentinel_graph.builders.graph_builder import GraphBuilder
>
> # Recommended
> from sentinel_graph import GraphSpecBuilder
> ```

### Constructor

```python
GraphSpecBuilder(context: ExecutionContext)
```

**Parameters:**
- `context` (ExecutionContext): Execution context containing Spark session and configuration

**Raises:**
- `ValueError`: If context is None or graph name can't be determined

### Static Methods

#### `start`

```python
GraphSpecBuilder.start(context: Optional[ExecutionContext] = None) -> GraphSpecBuilder
```

Define a new fluent graph builder.

**Parameters:**
- `context` (ExecutionContext, optional): ExecutionContext instance. If None, uses default context.

**Returns:**
- `GraphSpecBuilder`: New builder instance

**Example:**
```python
builder = GraphSpecBuilder.start(context=context)
```

### Instance Methods

#### `add_node`

```python
def add_node(alias: str) -> NodeBuilderInitial
```

Start building a node definition.

**Parameters:**
- `alias` (str): Unique identifier for this node within the graph

**Returns:**
- `NodeBuilderInitial`: Node builder in initial state

**Example:**
```python
builder.add_node("user")
```

#### `add_edge`

```python
def add_edge(alias: str) -> EdgeBuilderInitial
```

Start building an edge definition.

**Parameters:**
- `alias` (str): Identifier for this edge within the graph (can be shared across multiple edges)

**Returns:**
- `EdgeBuilderInitial`: Edge builder in initial state

**Example:**
```python
builder.add_edge("accessed")
```

#### `done`

```python
def done() -> GraphSpec
```

Finalize graph specification and return GraphSpec instance.

**Returns:**
- `GraphSpec`: Complete graph specification with data pipeline and schema

**Raises:**
- `ValueError`: If graph has no nodes or edges, or if validation fails

**Example:**
```python
graph_spec = builder.done()
```

## GraphSpec

Graph specification with data pipeline, schema, and display capabilities.

### Constructor

```python
GraphSpec(
    name: str,
    context: ExecutionContext,
    graph_schema: GraphSchema,
    etl_pipeline: Optional[ETLPipeline] = None
)
```

**Parameters:**
- `name` (str): Graph name
- `context` (ExecutionContext): Execution context
- `graph_schema` (GraphSchema): Graph schema definition
- `etl_pipeline` (ETLPipeline, optional): Data pipeline for graph preparation

### Properties

#### `nodes`

```python
def nodes() -> DataFrame
```

Get nodes DataFrame (lazy, cached). Automatically determines source from data pipeline or lake table.

**Returns:**
- `DataFrame`: Spark DataFrame containing all nodes

**Raises:**
- `ValueError`: If context is missing or DataFrames can't be loaded

#### `edges`

```python
def edges() -> DataFrame
```

Get edges DataFrame (lazy, cached). Automatically determines source from data pipeline or lake table.

**Returns:**
- `DataFrame`: Spark DataFrame containing all edges

**Raises:**
- `ValueError`: If context is missing or DataFrames can't be loaded

### Methods

#### `build_graph_with_data`

> [!NOTE]
>  `build_graph_with_data` is deprecated and will be removed in a future version.
> Use `Graph.build(spec)` instead.

```python
def build_graph_with_data() -> Dict[str, Any]
```

Execute the data pipeline and publish the graph.
Internally calls `Graph.build(self)`, stashes the returned `Graph`, and returns
a backward-compatible dictionary.

**Returns:**
- `Dict[str, Any]`: Dictionary containing:
  - `etl_result`: Data preparation results
  - `api_result`: Publish results (if successful)
  - `api_error`: Error string (if publish failed)
  - `instance_name`: Graph instance name
  - `status`: `"published"` or `"prepared"`


**Example:**
```python
graph = Graph.build(spec)
print(f"Status: {graph.build_status.status}")
```

#### `get_schema`

```python
def get_schema() -> GraphSchema
```

Get the graph schema.

**Returns:**
- `GraphSchema`: Graph schema definition

#### `get_pipeline`

> [!NOTE] 
> This method is deprecated and will be removed in a future version. The data pipeline is an internal implementation detail and shouldn't be accessed directly.

```python
def get_pipeline() -> Optional[ETLPipeline]
```

Get the data pipeline (None for existing graphs).

**Returns:**
- `ETLPipeline` or `None`: Data pipeline if available

#### `to_graphframe`

```python
def to_graphframe(column_mapping: Optional[Dict[str, str]] = None) -> GraphFrame
```

Convert entire graph to GraphFrame for running graph algorithms.
Operates on local data only (from data pipeline or lake table).

**Parameters:**
- `column_mapping` (Dict[str, str], optional): Custom column mapping with keys:
  - `"id"`: Vertex ID column name
  - `"source_id"`: Edge source ID column name
  - `"target_id"`: Edge target ID column name

**Returns:**
- `GraphFrame`: GraphFrame object with all vertices and edges

**Raises:**
- `ValueError`: If ExecutionContext isn't available

**Example:**
```python
gf = graph_spec.to_graphframe()
pagerank = gf.pageRank(resetProbability=0.15, maxIter=10)
```

#### `show`

```python
def show(limit: int = 100, viz_format: str = "visual") -> None
```

Display graph data in various formats.

**Parameters:**
- `limit` (int, default=100): Maximum nodes/edges to display
- `viz_format` (str, default="visual"): Output format
  - `"table"`: Full DataFrame tables (all columns)
  - `"visual"`: Interactive graph visualization
  - `"all"`: Show all formats

**Raises:**
- `ValueError`: If format isn't one of the supported values

**Example:**
```python
graph_spec.show(limit=50, viz_format="table")
```

#### `show_schema`

```python
def show_schema() -> None
```

Display the graph schema as an interactive graph visualization.

**Example:**
```python
spec.show_schema()
```

---

## Graph

Queryable graph instance. Created via `Graph.get()` (existing graph) or
`Graph.build()` (from a `GraphSpec`).

### Constructor

```python
Graph(
    name: str,
    context: ExecutionContext,
    spec: Optional[GraphSpec] = None,
    build_status: Optional[BuildStatus] = None,
)
```

**Parameters:**
- `name` (str): Graph name
- `context` (ExecutionContext): Execution context
- `spec` (GraphSpec, optional): Attached graph specification (set by `Graph.build()`)
- `build_status` (BuildStatus, optional): Build result metadata (set by `Graph.build()`)

**Raises:**
- `ValueError`: If ExecutionContext is None

### Static Methods

#### `get`

```python
Graph.get(name: str, context: Optional[ExecutionContext] = None) -> Graph
```

Get a graph instance from an existing graph.
The returned `Graph` has `spec=None` and `build_status=None`.

**Parameters:**
- `name` (str): Graph instance name
- `context` (ExecutionContext, optional): Execution context (defaults to ExecutionContext.default())

**Returns:**
- `Graph`: Graph instance

**Raises:**
- `ValueError`: If graph name is empty or graph instance doesn't exist

**Example:**
```python
graph = Graph.get("my_graph", context=context)
graph.query("MATCH (n) RETURN n")
```

#### `prepare`

```python
Graph.prepare(spec: GraphSpec) -> Graph
```

Run the data preparation stage for a `GraphSpec` **without** publishing. Use `publish()` afterwards to register the graph and make it queryable.

**Parameters:**
- `spec` (GraphSpec): Graph specification to prepare

**Returns:**
- `Graph`: Graph instance with `spec` attached and `build_status.status == "prepared"`

**Raises:**
- `ValueError`: If spec has no data pipeline or no execution context
- `RuntimeError`: If data pipeline execution fails

**Example:**
```python
spec = GraphSpecBuilder.start(context=ctx).add_node(...).done()
graph = Graph.prepare(spec)
# Inspect results before publishing
graph.nodes.show()
graph.publish()
graph.query("MATCH (n) RETURN n")
```

#### `build`

```python
Graph.build(spec: GraphSpec) -> Graph
```

Build a graph from a `GraphSpec` by preparing data and publishing. Internally calls `Graph.prepare(spec)` and then attempts `graph.publish()`. Unlike calling those two methods separately, publish failures are caught—the returned graph has `build_status.status == "prepared"` and `build_status.api_error` set instead of raising.

**Parameters:**
- `spec` (GraphSpec): Graph specification to build from

**Returns:**
- `Graph`: Graph instance with `spec` attached and `build_status` populated

**Raises:**
- `ValueError`: If spec has no data pipeline or no execution context
- `RuntimeError`: If data pipeline execution fails

**Example:**
```python
spec = GraphSpecBuilder.start(context=ctx).add_node(...).done()
graph = Graph.build(spec)
print(graph.build_status.status)  # "published" or "prepared" (None if neither ran)
graph.query("MATCH (n) RETURN n")
```

### Properties

#### `nodes`

```python
def nodes() -> Optional[DataFrame]
```

Get nodes DataFrame. Delegates to `self.spec.nodes` when a spec is attached;
returns `None` otherwise.

#### `edges`

```python
def edges() -> Optional[DataFrame]
```

Get edges DataFrame. Delegates to `self.spec.edges` when a spec is attached;
returns `None` otherwise.

#### `schema`

```python
def schema() -> Optional[GraphSchema]
```

Get graph schema. Delegates to `self.spec.get_schema()` when a spec is attached;
returns `None` otherwise.

### Methods

#### `query`

```python
def query(query_string: str, query_language: str = "GQL") -> QueryResult
```

Execute a query against the graph instance using GQL.

**Parameters:**
- `query_string` (str): Graph query string (GQL Language)
- `query_language` (str, default="GQL"): Query language

**Returns:**
- `QueryResult`: Object containing nodes, edges, and metadata

**Raises:**
- `ValueError`: If ExecutionContext or Spark session is missing
- `RuntimeError`: If client initialization or query execution fails

**Example:**
```python
result = graph.query("MATCH (u:user) WHERE u.age > 30 RETURN u")
result.show()
```

#### `reachability`

```python
def reachability(
    *,
    source_property_value: str = None,
    target_property_value: str = None,
    source_property: Optional[str] = None,
    participating_source_node_labels: Optional[List[str]] = None,
    target_property: Optional[str] = None,
    participating_target_node_labels: Optional[List[str]] = None,
    participating_edge_labels: Optional[List[str]] = None,
    is_directional: bool = True,
    min_hop_count: int = 1,
    max_hop_count: int = 4,
    shortest_path: bool = False,
    max_results: int = 500
) -> QueryResult
```

>  [!NOTE] 
> `reachability(query_input=ReachabilityQueryInput(...))` is still accepted but emits `DeprecationWarning` and will be removed in a future version.

Perform reachability analysis between source and target nodes.

**Parameters:**
- `source_property_value` (str): Value to match for the source property (validated at runtime. Must be provided when not using `query_input`)
- `target_property_value` (str): Value to match for the target property (validated at runtime. Must be provided when not using `query_input`)
- `source_property` (Optional[str]): Property name to filter source nodes
- `participating_source_node_labels` (Optional[List[str]]): Node labels to consider as sources
- `target_property` (Optional[str]): Property name to filter target nodes
- `participating_target_node_labels` (Optional[List[str]]): Node labels to consider as targets
- `participating_edge_labels` (Optional[List[str]]): Edge labels to traverse
- `is_directional` (bool): Whether edges are directional (default: `True`)
- `min_hop_count` (int): Minimum hops (default: `1`)
- `max_hop_count` (int): Maximum hops (default: `4`)
- `shortest_path` (bool): Return only shortest paths (default: `False`)
- `max_results` (int): Maximum results (default: `500`)

**Raises:**
- `ValueError`: If `source_property_value` or `target_property_value` is missing, `min_hop_count < 1`, `max_hop_count < min_hop_count`, or `max_results < 1`
- `RuntimeError`: If client initialization or query execution fails

**Returns:**
- `QueryResult`: Containing the reachability paths

**Example:**
```python
result = graph.reachability(
    source_property_value="user-001",
    target_property_value="device-003")
result.show()
```

#### `k_hop`

```python
def k_hop(
    *,
    source_property: Optional[str] = None,
    source_property_value: Optional[str] = None,
    participating_source_node_labels: Optional[List[str]] = None,
    target_property: Optional[str] = None,
    target_property_value: Optional[str] = None,
    participating_target_node_labels: Optional[List[str]] = None,
    participating_edge_labels: Optional[List[str]] = None,
    is_directional: bool = True,
    min_hop_count: int = 1,
    max_hop_count: int = 4,
    shortest_path: bool = False,
    max_results: int = 500
) -> QueryResult
```

> [!NOTE] 
> `k_hop(query_input=K_HopQueryInput(...))` is still accepted but emits `DeprecationWarning` and will be removed in a future version.

Perform k-hop analysis from a given source node.

**Parameters:**
- Same as [`reachability`](#reachability)

**Validation:**
- At least one of `source_property_value` or `target_property_value` must be provided

**Raises:**
- `ValueError`: If neither `source_property_value` nor `target_property_value` is provided, or if numeric constraints are violated (same as [`reachability`](#reachability))
- `RuntimeError`: If client initialization or query execution fails

**Returns:**
- `QueryResult`: Containing the k-hop results

**Example:**
```python
result = graph.k_hop(source_property_value="user-001")
result.show()
```

#### `blast_radius`

```python
def blast_radius(
    *,
    source_property_value: str = None,
    target_property_value: str = None,
    source_property: Optional[str] = None,
    participating_source_node_labels: Optional[List[str]] = None,
    target_property: Optional[str] = None,
    participating_target_node_labels: Optional[List[str]] = None,
    participating_edge_labels: Optional[List[str]] = None,
    is_directional: bool = True,
    min_hop_count: int = 1,
    max_hop_count: int = 4,
    shortest_path: bool = False,
    max_results: int = 500
) -> QueryResult
```

> [!NOTE] 
> `blast_radius(query_input=BlastRadiusQueryInput(...))` is still accepted but emits `DeprecationWarning` and will be removed in a future version.

Perform blast radius analysis from source node to target node.

**Parameters:**
- `source_property_value` (str): Value identifying the source node (validated at runtime. Must be provided when not using `query_input`)
- `target_property_value` (str): Value identifying the target node (validated at runtime. Must be provided when not using `query_input`)
- Other parameters: same as [`reachability`](#reachability)

**Raises:**
- `ValueError`: If `source_property_value` or `target_property_value` is missing, or if numeric constraints are violated (same as [`reachability`](#reachability))
- `RuntimeError`: If client initialization or query execution fails

**Returns:**
- `QueryResult`: Containing the blast radius results

**Example:**
```python
result = graph.blast_radius(
    source_property_value="user-003",
    target_property_value="device-003",
    min_hop_count=1)
result.show()
```

#### `centrality`

```python
def centrality(
    *,
    participating_source_node_labels: Optional[List[str]] = None,
    participating_target_node_labels: Optional[List[str]] = None,
    participating_edge_labels: Optional[List[str]] = None,
    threshold: int = 3,
    centrality_type: CentralityType = None,
    max_paths: int = 1000000,
    is_directional: bool = True,
    min_hop_count: int = 1,
    max_hop_count: int = 4,
    shortest_path: bool = False,
    max_results: int = 500
) -> QueryResult
```

> [!NOTE] 
> `centrality(query_input=CentralityQueryInput(...))` is still accepted but emits `DeprecationWarning` and will be removed in a future version.

Perform centrality analysis on the graph.

**Parameters:**
- `participating_source_node_labels` (Optional[List[str]]): Source node labels
- `participating_target_node_labels` (Optional[List[str]]): Target node labels
- `participating_edge_labels` (Optional[List[str]]): Edge labels to traverse
- `threshold` (int): Minimum centrality score (default: `3`); must be non-negative
- `centrality_type` (CentralityType): `CentralityType.Node` or `CentralityType.Edge` (default: `None`, falls back to `CentralityType.Node`)
- `max_paths` (int): Maximum paths to consider (default: `1000000`; `0` = all paths); must be non-negative
- `is_directional` (bool): Whether edges are directional (default: `True`)
- `min_hop_count` (int): Minimum hops (default: `1`); must be ≥ 1
- `max_hop_count` (int): Maximum hops (default: `4`); must be ≥ `min_hop_count`
- `shortest_path` (bool): Return only shortest paths (default: `False`)
- `max_results` (int): Maximum results (default: `500`); must be ≥ 1

**Raises:**
- `ValueError`: If `threshold < 0`, `max_paths < 0`, `min_hop_count < 1`, `max_hop_count < min_hop_count`, or `max_results < 1`
- `RuntimeError`: If client initialization or query execution fails

**Returns:**
- `QueryResult`: Containing the centrality metrics

**Example:**
```python
result = graph.centrality(
    participating_source_node_labels=["user", "device"],
    participating_target_node_labels=["device", "user"],
    participating_edge_labels=["sign_in"],
    is_directional=False)
result.show()
```

#### `ranked`

```python
def ranked(
    *,
    rank_property_name: str = None,
    threshold: int = 0,
    max_paths: int = 1000000,
    decay_factor: float = 1,
    is_directional: bool = True,
    min_hop_count: int = 1,
    max_hop_count: int = 4,
    shortest_path: bool = False,
    max_results: int = 500
) -> QueryResult
```

> [!NOTE] 
> `ranked(query_input=RankedQueryInput(...))` is still accepted but emits `DeprecationWarning` and will be removed in a future version.

Perform ranked analysis on the graph.

**Parameters:**
- `rank_property_name` (str): Property name to use for ranking (validated at runtime. Must be provided when not using `query_input`)
- `threshold` (int): Only return paths above this weight (default: `0`); must be non-negative
- `max_paths` (int): Maximum paths to consider (default: `1000000`; `0` = all paths); must be non-negative
- `decay_factor` (float): Rank decay per step; 2 means halving (default: `1`); must be non-negative
- `is_directional` (bool): Whether edges are directional (default: `True`)
- `min_hop_count` (int): Minimum hops (default: `1`); must be ≥ 1
- `max_hop_count` (int): Maximum hops (default: `4`); must be ≥ `min_hop_count`
- `shortest_path` (bool): Return only shortest paths (default: `False`)
- `max_results` (int): Maximum results (default: `500`); must be ≥ 1

**Raises:**
- `ValueError`: If `rank_property_name` is missing, `threshold < 0`, `max_paths < 0`, `decay_factor < 0`, `min_hop_count < 1`, `max_hop_count < min_hop_count`, or `max_results < 1`
- `RuntimeError`: If client initialization or query execution fails

**Returns:**
- `QueryResult`: Containing the ranked nodes/edges

**Example:**
```python
result = graph.ranked(
    rank_property_name="risk_score",
    threshold=5,
    decay_factor=2)
result.show()
```

#### `to_graphframe`

```python
def to_graphframe(column_mapping: Optional[Dict[str, str]] = None) -> GraphFrame
```

Convert entire graph to GraphFrame. Uses spec data when available; reads from
lake tables otherwise.

**Parameters:**
- `column_mapping` (Dict[str, str], optional): Custom column mapping

**Returns:**
- `GraphFrame`: GraphFrame object with all vertices and edges

**Example:**
```python
gf = graph.to_graphframe()
```

#### `show`

```python
def show() -> None
```

Display graph info. Delegates to `spec.show()` for rich display when a spec
is attached; prints minimal info otherwise.

#### `show_schema`

```python
def show_schema() -> None
```

Display graph schema. Delegates to `spec.show_schema()` when a spec is attached;
prints a message indicating no schema is available otherwise.

#### `publish` *(new in v0.3.3)*

```python
def publish() -> Graph
```

Register the graph with the API, making it queryable. Call this after
`Graph.prepare()` (or on any `Graph` that has a spec attached) to publish the
graph instance.

**Returns:**
- `Graph`: Self for method chaining

**Raises:**
- `ValueError`: If no spec is attached or context is missing
- `RuntimeError`: If publish fails

**Example:**
```python
graph = Graph.prepare(spec)
graph.publish()
# Now the graph is queryable
graph.query("MATCH (n) RETURN n")
```

---

## BuildStatus

Dataclass carrying metadata from a `Graph.build()` operation.

### Fields

| Field | Type | Description |
|---|---|---|
| `etl_result` | `Any` | Result from the `prepare` stage (data pipeline execution) |
| `api_result` | `Optional[Dict]` | Result from the publish stage (`None` if publish failed) |
| `api_error` | `Optional[str]` | Error message if publish failed (`None` if publish succeeded) |
| `instance_name` | `str` | Name of the graph instance |
| `status` | `Optional[BuildStatusKind]` | `None`, `"published"`, or `"prepared"` |

### Construction Paths

```
GraphSpecBuilder.start(...).done()  →  GraphSpec             (spec only, no graph yet)
Graph.get(name, context)            →  Graph (spec=None, build_status=None)
Graph.prepare(spec)                 →  Graph (spec=spec, build_status.status="prepared")
graph.publish()                     →  Graph (build_status.status="published")
Graph.build(spec)                   →  Graph (prepare + publish in one step)
```

**Example:**
```python
graph = Graph.build(spec)
if graph.build_status.status == "published":
    print("Graph prepared and published successfully")
elif graph.build_status.status == "prepared":
    print(f"Prepare succeeded but publish failed: {graph.build_status.api_error}")
elif graph.build_status.status is None:
    print("Neither prepare nor publish has run")
```

---

## Node Builders

### NodeBuilderInitial

Initial state for node builder: only data source methods available.

#### Constructor

```python
NodeBuilderInitial(alias: str, graph_builder: GraphSpecBuilder)
```

**Note:** Typically created via `GraphSpecBuilder.add_node()`, not directly instantiated.

#### Methods

##### `from_table`

```python
def from_table(table_name: str, database: Optional[str] = None) -> NodeBuilderSourceSet
```

Set table as data source with intelligent database resolution.

**Parameters:**
- `table_name` (str): Name of the table (required)
- `database` (str, optional): Explicit database name (takes precedence over context default)

**Returns:**
- `NodeBuilderSourceSet`: Builder for further configuration

**Raises:**
- `ValueError`: If table not found or multiple conflicting tables found

**Database Resolution Order:**
1. Explicit `database` parameter (highest precedence)
2. ExecutionContext.default_database
3. Search all databases (with conflict detection)

**Example:**
```python
builder.add_node("user").from_table("SigninLogs", database="security_db")
```

##### `from_dataframe`

```python
def from_dataframe(dataframe: DataFrame) -> NodeBuilderSourceSet
```

Set Spark DataFrame as data source.

**Parameters:**
- `dataframe` (DataFrame): Spark DataFrame

**Returns:**
- `NodeBuilderSourceSet`: Builder for further configuration

**Example:**
```python
df = spark.read.table("users")
builder.add_node("user").from_dataframe(df)
```

---

### NodeBuilderSourceSet

Node builder after data source is set: configuration methods available.

#### Constructor

```python
NodeBuilderSourceSet(alias: str, graph_builder: GraphSpecBuilder, source_step: DataInputETLStep)
```

**Note:** Created internally by NodeBuilderInitial source methods. 

#### Methods

##### `with_time_range`

```python
def with_time_range(
    time_column: str,
    start_time: Optional[Union[str, datetime]] = None,
    end_time: Optional[Union[str, datetime]] = None,
    lookback_hours: Optional[float] = None
) -> NodeBuilderSourceSet
```

Apply time range filtering to the node's data source.

**Parameters:**
- `time_column` (str): Column name containing timestamp data (required)
- `start_time` (str or datetime, optional): Start date ('10/20/25', '2025-10-20', or datetime object)
- `end_time` (str or datetime, optional): End date (same formats as start_time)
- `lookback_hours` (float, optional): Hours to look back from now

**Returns:**
- `NodeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If time column not found in source schema

**Time Range Logic:**
1. If start_time and end_time provided: use them directly
2. If only lookback_hours provided: end=now, start=now-lookback_hours
3. If nothing provided: no time filtering
4. If start/end AND lookback_hours: start/end take precedence

**Example:**
```python
# Explicit date range
builder.add_node("user").from_table("SigninLogs") \
    .with_time_range(time_column="TimeGenerated", start_time="2025-01-01", end_time="2025-01-31")

# Lookback window
builder.add_node("user").from_table("SigninLogs") \
    .with_time_range(time_column="TimeGenerated", lookback_hours=24)
```

##### `with_label`

```python
def with_label(label: str) -> NodeBuilderSourceSet
```

Set node label (defaults to alias if not called).

**Parameters:**
- `label` (str): Node label

**Returns:**
- `NodeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If label already set

**Example:**
```python
builder.add_node("u").from_table("Users").with_label("user")
```

##### `with_columns`

```python
def with_columns(
    *columns: str,
    key: str,
    display: str
) -> NodeBuilderSourceSet
```

Configure columns with required key and display designation.

**Parameters:**
- `*columns` (str): Column names to include (at least one required)
- `key` (str): Column name to mark as key (required, must be in columns)
- `display` (str): Column name to mark as display value (required, must be in columns, can be same as key)

**Returns:**
- `NodeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If validation fails (duplicate columns, missing key/display, etc.)

**Notes:**
- Properties are automatically built from column types
- Time filter column is automatically added if specified
- Property types are auto-inferred from source schema

- See **Restrictions** 

**Example:**
```python
builder.add_node("user").from_table("Users") \
    .with_columns("id", "name", "email", "created_at", key="id", display="name")
```

##### `add_node`

```python
def add_node(alias: str) -> NodeBuilderInitial
```

Finish this node and start building another node.

**Parameters:**
- `alias` (str): Alias for the new node

**Returns:**
- `NodeBuilderInitial`: New node builder

**Example:**
```python
builder.add_node("user").from_table("Users") \
    .with_columns("id", "name", key="id", display="name") \
    .add_node("device")
```

##### `add_edge`

```python
def add_edge(alias: str) -> EdgeBuilderInitial
```

Finish this node and start building an edge.

**Parameters:**
- `alias` (str): Alias for the edge

**Returns:**
- `EdgeBuilderInitial`: New edge builder

**Example:**
```python
builder.add_node("user").from_table("Users") \
    .with_columns("id", "name", key="id", display="name") \
    .add_edge("accessed")
```

##### `done`

```python
def done() -> GraphSpec
```

Finalize this node and complete the graph specification.

**Returns:**
- `GraphSpec`: Complete graph specification

**Example:**
```python
graph_spec = builder.add_node("user").from_table("Users") \
    .with_columns("id", "name", key="id", display="name") \
    .done()
```

---

## Edge Builders

### EdgeBuilderInitial

Initial state for edge builder: only data source methods available.

#### Constructor

```python
EdgeBuilderInitial(alias: str, graph_builder: GraphSpecBuilder)
```

**Note:** Typically created via `GraphSpecBuilder.add_edge()`, not directly instantiated.

#### Methods

##### `from_table`

```python
def from_table(table_name: str, database: Optional[str] = None) -> EdgeBuilderSourceSet
```

Set table as data source with intelligent database resolution.

**Parameters:**
- `table_name` (str): Name of the table (required)
- `database` (str, optional): Explicit database name

**Returns:**
- `EdgeBuilderSourceSet`: Builder for further configuration

**Raises:**
- `ValueError`: If table not found or multiple conflicting tables found

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs")
```

##### `from_dataframe`

```python
def from_dataframe(dataframe: DataFrame) -> EdgeBuilderSourceSet
```

Set Spark DataFrame as data source.

**Parameters:**
- `dataframe` (DataFrame): Spark DataFrame

**Returns:**
- `EdgeBuilderSourceSet`: Builder for further configuration

**Example:**
```python
df = spark.read.table("access_logs")
builder.add_edge("accessed").from_dataframe(df)
```

---

### EdgeBuilderSourceSet

Edge builder after data source is set: configuration methods available.

#### Constructor

```python
EdgeBuilderSourceSet(alias: str, graph_builder: GraphSpecBuilder, source_step: DataInputETLStep)
```

**Note:** Created internally by EdgeBuilderInitial source methods.

#### Methods

##### `with_label`

```python
def with_label(label: str) -> EdgeBuilderSourceSet
```

Set edge relationship type/label (defaults to alias if not called).

**Parameters:**
- `label` (str): Edge label

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If label already set

**Example:**
```python
builder.add_edge("rel").from_table("AccessLogs").with_label("ACCESSED")
```

##### `edge_label`

> [!NOTE]
> Use `with_label()` instead. This method will be removed in a future version.

```python
def edge_label(label: str) -> EdgeBuilderSourceSet
```

Set edge relationship type/label (defaults to alias if not called).

**Parameters:**
- `label` (str): Edge label

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If label already set

**Example:**
```python
builder.add_edge("acc").from_table("AccessLogs").edge_label("accessed")
```

##### `source`

```python
def source(id_column: str, node_type: str) -> EdgeBuilderSourceSet
```

Set source node with ID column and label.

**Parameters:**
- `id_column` (str): Column name containing source node ID
- `node_type` (str): Source node label

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If source already set

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs") \
    .source(id_column="user_id", node_type="user")
```

##### `target`

```python
def target(id_column: str, node_type: str) -> EdgeBuilderSourceSet
```

Set target node with ID column and label.

**Parameters:**
- `id_column` (str): Column name containing target node ID
- `node_type` (str): Target node label

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If target already set

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs") \
    .source(id_column="user_id", node_type="user") \
    .target(id_column="device_id", node_type="device")
```

##### `with_time_range`

```python
def with_time_range(
    time_column: str,
    start_time: Optional[Union[str, datetime]] = None,
    end_time: Optional[Union[str, datetime]] = None,
    lookback_hours: Optional[float] = None
) -> EdgeBuilderSourceSet
```

Apply time range filtering to the edge's data source.

**Parameters:**
- `time_column` (str): Column name containing timestamp data (required)
- `start_time` (str or datetime, optional): Start date
- `end_time` (str or datetime, optional): End date
- `lookback_hours` (float, optional): Hours to look back from now

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If time column not found in source schema

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs") \
    .with_time_range(time_column="TimeGenerated", lookback_hours=48)
```

##### `with_columns`

```python
def with_columns(
    *columns: str,
    key: str,
    display: str
) -> EdgeBuilderSourceSet
```

Configure columns with required key and display designation.

**Parameters:**
- `*columns` (str): Column names to include (at least one required)
- `key` (str): Column name to mark as key (required, must be in columns)
- `display` (str): Column name to mark as display value (required, must be in columns)

**Returns:**
- `EdgeBuilderSourceSet`: Self for method chaining

**Raises:**
- `ValueError`: If validation fails

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs") \
    .source(id_column="user_id", node_type="user") \
    .target(id_column="device_id", node_type="device") \
    .with_columns("id", "location", "status", key="id", display="location")
```

##### `add_node`

```python
def add_node(alias: str) -> NodeBuilderInitial
```

Finish this edge and start building a node.

**Parameters:**
- `alias` (str): Alias for the new node

**Returns:**
- `NodeBuilderInitial`: New node builder

##### `add_edge`

```python
def add_edge(alias: str) -> EdgeBuilderInitial
```

Finish this edge and start building another edge.

**Parameters:**
- `alias` (str): Alias for the new edge

**Returns:**
- `EdgeBuilderInitial`: New edge builder

**Example:**
```python
builder.add_edge("accessed").from_table("AccessLogs") \
    .source(id_column="user_id", node_type="user") \
    .target(id_column="device_id", node_type="device") \
    .with_columns("id", "location", key="id", display="location") \
    .add_edge("connected_to")
```

##### `done`

```python
def done() -> GraphSpec
```

Finalize this edge and complete the graph specification.

**Returns:**
- `GraphSpec`: Complete graph specification

---

## Schema Classes

### GraphDefinitionReference

Reference to a graph definition with name and version.

#### Constructor

```python
GraphDefinitionReference(
    fully_qualified_name: str,
    version: str
)
```

**Parameters:**
- `fully_qualified_name` (str): Fully qualified name of the referenced graph
- `version` (str): Version of the referenced graph

**Raises:**
- `ValueError`: If fully_qualified_name or version is empty

#### Methods

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize to dictionary.

**Returns:**
- `Dict[str, Any]`: Serialized reference

---

### Property

Property definition with type-safe interface.

#### Constructor

```python
Property(
    name: str,
    property_type: PropertyType,
    is_non_null: bool = False,
    description: str = "",
    is_key: bool = False,
    is_display_value: bool = False,
    is_internal: bool = False
)
```

**Parameters:**
- `name` (str): Property name
- `property_type` (PropertyType): Property data type
- `is_non_null` (bool, default=False): Whether property is required
- `description` (str, default=""): Property description
- `is_key` (bool, default=False): Whether property is a key
- `is_display_value` (bool, default=False): Whether property is display value
- `is_internal` (bool, default=False): Whether property is internal

**Raises:**
- `ValueError`: If name is empty or validation fails

#### Class Methods

##### `key`

```python
@classmethod
Property.key(
    name: str,
    property_type: PropertyType,
    description: str = "",
    is_non_null: bool = False
) -> Property
```

Create a key property with common settings (is_key=True, is_display_value=True).

##### `display`

```python
@classmethod
Property.display(
    name: str,
    property_type: PropertyType,
    description: str = "",
    is_non_null: bool = False
) -> Property
```

Create a display value property (is_display_value=True).

#### Methods

##### `describe`

```python
def describe(text: str) -> Property
```

Add description fluently.

**Parameters:**
- `text` (str): Description text

**Returns:**
- `Property`: Self for method chaining

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize property to dictionary with @-prefixed annotation keys.

**Returns:**
- `Dict[str, Any]`: Serialized property

##### `to_gql`

```python
def to_gql() -> str
```

Generate GQL property definition.

**Returns:**
- `str`: GQL string representation

---

### EdgeNode

Node reference used in edge definitions.

#### Constructor

```python
EdgeNode(
    alias: Optional[str] = None,
    labels: List[str] = []
)
```

**Parameters:**
- `alias` (str, optional): Node alias (auto-set to first label if None or empty)
- `labels` (List[str]): Node labels (at least one required)

**Raises:**
- `ValueError`: If labels list is empty
- `TypeError`: If labels aren't strings

**Auto-mutation:**
- If alias is None or empty, it's set to the first label

#### Methods

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize to dictionary.

**Returns:**
- `Dict[str, Any]`: Serialized edge node reference

---

### Node

Node definition with type-safe interface.

#### Constructor

```python
Node(
    alias: str = "",
    labels: List[str] = [],
    implies_labels: List[str] = [],
    properties: List[Property] = [],
    description: str = "",
    entity_group: str = "",
    dynamic_labels: bool = False,
    abstract_edge_aliases: bool = False
)
```

**Parameters:**
- `alias` (str, default=""): Node alias (auto-set to first label if empty)
- `labels` (List[str]): Node labels (at least one required)
- `implies_labels` (List[str], default=[]): Implied labels
- `properties` (List[Property], default=[]): Node properties
- `description` (str, default=""): Node description
- `entity_group` (str, default=""): Entity group name
- `dynamic_labels` (bool, default=False): Whether node has dynamic labels
- `abstract_edge_aliases` (bool, default=False): Whether node uses abstract edge aliases

**Raises:**
- `ValueError`: If validation fails (no labels, no key property, no display property, etc.)

**Auto-mutation:**
- If alias is empty, it's set to the first label
- If entity_group is empty, it's set to the primary label

#### Methods

##### `get_primary_label`

```python
def get_primary_label() -> Optional[str]
```

Get the primary (first) label.

**Returns:**
- `str` or `None`: Primary label or None if no labels

##### `get_entity_group_name`

```python
def get_entity_group_name() -> str
```

Get entity group name or fallback to primary label.

**Returns:**
- `str`: Entity group name

##### `get_primary_key_property_name`

```python
def get_primary_key_property_name() -> Optional[str]
```

Get the name of the primary key property.

**Returns:**
- `str` or `None`: Primary key property name

##### `get_properties`

```python
def get_properties() -> Dict[str, Property]
```

Get properties as a dictionary for easy access.

**Returns:**
- `Dict[str, Property]`: Properties keyed by name

##### `get_property`

```python
def get_property(name: str) -> Optional[Property]
```

Get a specific property by name.

**Parameters:**
- `name` (str): Property name

**Returns:**
- `Property` or `None`: Property if found

##### `add_property`

```python
def add_property(prop: Property) -> None
```

Add a property to this node.

**Parameters:**
- `prop` (Property): Property to add

**Raises:**
- `ValueError`: If property name is duplicate

##### `is_dynamically_labeled`

```python
def is_dynamically_labeled() -> bool
```

Check if node has dynamic labels.

**Returns:**
- `bool`: True if dynamic labels enabled

##### `is_abstract_edge_node_aliases`

```python
def is_abstract_edge_node_aliases() -> bool
```

Check if node uses abstract edge node aliases.

**Returns:**
- `bool`: True if abstract edge aliases enabled

##### `describe`

```python
def describe(text: str) -> Node
```

Add description fluently.

**Parameters:**
- `text` (str): Description text

**Returns:**
- `Node`: Self for method chaining

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize node to dictionary.

**Returns:**
- `Dict[str, Any]`: Serialized node

##### `to_gql`

```python
def to_gql() -> str
```

Generate GQL node definition.

**Returns:**
- `str`: GQL string representation

**Raises:**
- `ValueError`: If node lacks required fields for GQL

#### Class Methods

##### `create`

```python
@classmethod
Node.create(
    alias: str,
    labels: List[str],
    properties: List[Property],
    description: str = "",
    entity_group: str = "",
    **kwargs
) -> Node
```

Create a node with all required fields.

**Parameters:**
- `alias` (str): Node alias
- `labels` (List[str]): Node labels
- `properties` (List[Property]): Node properties
- `description` (str, default=""): Node description
- `entity_group` (str, default=""): Entity group name

**Returns:**
- `Node`: New node instance

---

### Edge

Edge definition with type-safe interface.

#### Constructor

```python
Edge(
    relationship_type: str,
    source_node_label: str,
    target_node_label: str,
    direction: EdgeDirection = EdgeDirection.DIRECTED_RIGHT,
    properties: List[Property] = [],
    description: str = "",
    entity_group: str = "",
    dynamic_type: bool = False
)
```

**Parameters:**
- `relationship_type` (str): Edge relationship type (for example, "FOLLOWS", "OWNS")
- `source_node_label` (str): Source node label
- `target_node_label` (str): Target node label
- `direction` (EdgeDirection, default=DIRECTED_RIGHT): Edge direction
- `properties` (List[Property], default=[]): Edge properties
- `description` (str, default=""): Edge description
- `entity_group` (str, default=""): Entity group name
- `dynamic_type` (bool, default=False): Whether edge has dynamic type

**Raises:**
- `ValueError`: If validation fails

**Auto-mutation:**
- `labels` list is automatically populated with `[relationship_type]`
- If entity_group is empty, it's set to relationship_type

#### Properties

##### `edge_type`

```python
def edge_type() -> str
```

Backward compatibility alias for relationship_type.

**Returns:**
- `str`: Relationship type

#### Methods

##### `get_entity_group_name`

```python
def get_entity_group_name() -> str
```

Get entity group name or fallback to relationship type.

**Returns:**
- `str`: Entity group name

##### `is_dynamic_type`

```python
def is_dynamic_type() -> bool
```

Check if edge has dynamic type.

**Returns:**
- `bool`: True if dynamic type

##### `add_property`

```python
def add_property(edge_property: Property) -> None
```

Add a property to this edge.

**Parameters:**
- `edge_property` (Property): Property to add

##### `describe`

```python
def describe(text: str) -> Edge
```

Add description fluently.

**Parameters:**
- `text` (str): Description text

**Returns:**
- `Edge`: Self for method chaining

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize edge to dictionary.

**Returns:**
- `Dict[str, Any]`: Serialized edge

##### `to_gql`

```python
def to_gql() -> str
```

Generate GQL edge definition.

**Returns:**
- `str`: GQL string representation

#### Class Methods

##### `create`

```python
Edge.create(
    relationship_type: str,
    source_node_label: str,
    target_node_label: str,
    properties: List[Property] = None,
    description: str = "",
    entity_group: str = "",
    **kwargs
) -> Edge
```

Create an edge with all required fields.

**Parameters:**
- `relationship_type` (str): Edge relationship type
- `source_node_label` (str): Source node label
- `target_node_label` (str): Target node label
- `properties` (List[Property], optional): Edge properties
- `description` (str, default=""): Edge description
- `entity_group` (str, default=""): Entity group name

**Returns:**
- `Edge`: New edge instance

---

### GraphSchema

Graph schema definition with type-safe interface.

#### Constructor

```python
GraphSchema(
    name: str,
    nodes: List[Node] = [],
    edges: List[Edge] = [],
    base_graphs: List[GraphSchema] = [],
    description: str = "",
    version: str = "1.0",
    fully_qualified_name: str = "",
    namespace: str = ""
)
```

**Parameters:**
- `name` (str): Graph schema name
- `nodes` (List[Node], default=[]): Node definitions
- `edges` (List[Edge], default=[]): Edge definitions
- `base_graphs` (List[GraphSchema], default=[]): Base graph schemas
- `description` (str, default=""): Schema description
- `version` (str, default="1.0"): Schema version
- `fully_qualified_name` (str, default=""): Fully qualified name
- `namespace` (str, default=""): Namespace

**Raises:**
- `ValueError`: If validation fails (duplicate aliases, edges reference nonexistent nodes, etc.)

#### Methods

##### `get_fully_qualified_name`

```python
def get_fully_qualified_name() -> str
```

Get fully qualified name.

**Returns:**
- `str`: Fully qualified name

##### `get_namespace`

```python
def get_namespace() -> str
```

Get namespace from fully qualified name or return default.

**Returns:**
- `str`: Namespace

##### `get_version`

```python
def get_version() -> str
```

Get version.

**Returns:**
- `str`: Version string

##### `get_node`

```python
def get_node(label_or_alias: str) -> Optional[Node]
```

Get node by label or alias.

**Parameters:**
- `label_or_alias` (str): Node label or alias

**Returns:**
- `Node` or `None`: Node if found

##### `get_edge`

```python
def get_edge(name: str) -> Optional[Edge]
```

Get edge by name/type.

**Parameters:**
- `name` (str): Edge relationship type

**Returns:**
- `Edge` or `None`: Edge if found

##### `add_node`

```python
def add_node(node: Node) -> None
```

Add a node to this graph.

**Parameters:**
- `node` (Node): Node to add

**Raises:**
- `ValueError`: If node alias is duplicate

##### `add_edge`

```python
def add_edge(edge: Edge) -> None
```

Add an edge to this graph.

**Parameters:**
- `edge` (Edge): Edge to add

**Raises:**
- `ValueError`: If edge type is duplicate

##### `include_graph`

```python
def include_graph(fully_qualified_name: str, version: str) -> GraphSchema
```

Add a graph include (fluent API).

**Parameters:**
- `fully_qualified_name` (str): Fully qualified name of graph to include
- `version` (str): Version of graph to include

**Returns:**
- `GraphSchema`: Self for method chaining

##### `get_included_graph_references`

```python
def get_included_graph_references() -> List[GraphDefinitionReference]
```

Get list of included graph references.

**Returns:**
- `List[GraphDefinitionReference]`: List of graph definition references

##### `describe`

```python
def describe(text: str) -> GraphSchema
```

Add description fluently.

**Parameters:**
- `text` (str): Description text

**Returns:**
- `GraphSchema`: Self for method chaining

##### `to_dict`

```python
def to_dict() -> Dict[str, Any]
```

Serialize schema to dictionary.

**Returns:**
- `Dict[str, Any]`: Serialized schema

##### `to_json`

```python
def to_json(indent: int = 2) -> str
```

Generate JSON representation.

**Parameters:**
- `indent` (int, default=2): JSON indentation level

**Returns:**
- `str`: JSON string

##### `to_gql`

```python
def to_gql() -> str
```

Generate GQL schema definition.

**Returns:**
- `str`: GQL string representation

#### Class Methods

##### `create`

```python
@classmethod
GraphSchema.create(
    name: str,
    nodes: List[Node] = None,
    edges: List[Edge] = None,
    description: str = "",
    version: str = "1.0",
    **kwargs
) -> GraphSchema
```

Create a graph schema with all required fields.

**Parameters:**
- `name` (str): Graph schema name
- `nodes` (List[Node], optional): Node definitions
- `edges` (List[Edge], optional): Edge definitions
- `description` (str, default=""): Schema description
- `version` (str, default="1.0"): Schema version

**Returns:**
- `GraphSchema`: New graph schema instance

---

## Query Input Classes

Dataclasses representing input parameters for predefined graph queries.

> [!NOTE]
> Passing `QueryInput` objects directly to `Graph` query methods is deprecated and will be removed in future versions. 
> Use keyword arguments instead. The `Graph` methods (`reachability`, `k_hop`, `blast_radius`, `centrality`, `ranked`) accept all parameters as keyword arguments and construct the input objects internally. These classes remain in the codebase for now but shouldn't be used in new code.

### QueryInputBase

Base class for all query input parameters.

#### Methods

##### `to_json_payload`

```python
def to_json_payload() -> Dict[str, Any]
```

Convert the input parameters to a dictionary for API submission.

**Returns:**
- `Dict[str, Any]`: Dictionary representation of the input parameters

##### `validate`

```python
def validate() -> None
```

Validate the input parameters.

**Raises:**
- `ValueError`: If the input parameters are invalid

---

### ReachabilityQueryInput

Input parameters for a reachability query between source and target nodes.
Inherits from `ReachabilityQueryInputBase` which inherits from `QueryInputBase`.

#### Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `source_property_value` | `str` | *(required)* | Value to match for the source property |
| `target_property_value` | `str` | *(required)* | Value to match for the target property |
| `source_property` | `Optional[str]` | `None` | Property name to filter source nodes |
| `participating_source_node_labels` | `Optional[List[str]]` | `None` | Node labels to consider as source nodes |
| `target_property` | `Optional[str]` | `None` | Property name to filter target nodes |
| `participating_target_node_labels` | `Optional[List[str]]` | `None` | Node labels to consider as target nodes |
| `participating_edge_labels` | `Optional[List[str]]` | `None` | Edge labels to traverse in the path |
| `is_directional` | `Optional[bool]` | `True` | Whether the edges are directional |
| `min_hop_count` | `Optional[int]` | `1` | Minimum number of hops in the path |
| `max_hop_count` | `Optional[int]` | `4` | Maximum number of hops in the path |
| `shortest_path` | `Optional[bool]` | `False` | Whether to find only the shortest path |
| `max_results` | `Optional[int]` | `500` | Maximum number of results to return |

**Validation:**
- `source_property_value` is required
- `target_property_value` is required

**Example:**
```python
# Preferred: keyword arguments (no import needed)
result = graph.reachability(
    source_property="UserId",
    source_property_value="user123",
    target_property="DeviceId",
    target_property_value="device456",
    participating_edge_labels=["accessed", "connected_to"],
    shortest_path=True
)

# DEPRECATED — will be removed in a future version. Use keyword arguments above.
from sentinel_graph.builders.query_input import ReachabilityQueryInput
result = graph.reachability(query_input=ReachabilityQueryInput(
    source_property_value="user123",
    target_property_value="device456"
))
```

---

### K_HopQueryInput

Input parameters for a k-hop query from a given source node.
Inherits from `ReachabilityQueryInputBase`.

Inherits all fields from `ReachabilityQueryInput`.

**Validation:**
- At least one of `source_property_value` or `target_property_value` must be provided

**Example:**
```python
# Preferred: keyword arguments
result = graph.k_hop(
    source_property_value="user123",
    max_hop_count=3,
    participating_edge_labels=["accessed"]
)

# DEPRECATED — will be removed in a future version. Use keyword arguments above.
from sentinel_graph.builders.query_input import K_HopQueryInput
result = graph.k_hop(query_input=K_HopQueryInput(source_property_value="user123"))
```

---

### BlastRadiusQueryInput

Input parameters for a blast radius query from source to target nodes.
Inherits from `ReachabilityQueryInputBase`.

Inherits all fields from `ReachabilityQueryInput`, with the following required fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `source_property_value` | `str` | Yes | Value to identify the source node |
| `target_property_value` | `str` | Yes | Value to identify the target node |

**Validation:**
- `source_property_value` is required
- `target_property_value` is required

**Example:**
```python
# Preferred: keyword arguments
result = graph.blast_radius(
    source_property_value="user123",
    target_property_value="device456",
    participating_edge_labels=["accessed", "connected_to"]
)

# DEPRECATED — will be removed in a future version. Use keyword arguments above.
from sentinel_graph.builders.query_input import BlastRadiusQueryInput
result = graph.blast_radius(query_input=BlastRadiusQueryInput(
    source_property_value="user123",
    target_property_value="device456"
))
```

---

### CentralityQueryInput

Input parameters for a centrality analysis query.
Inherits from `QueryInputBase`.

#### CentralityType Enum

| Value | Description |
|---|---|
| `CentralityType.Node` | Compute node centrality |
| `CentralityType.Edge` | Compute edge centrality |

#### Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `threshold` | `Optional[int]` | `3` | Minimum centrality score to consider |
| `centrality_type` | `CentralityType` | `CentralityType.Node` | Type of centrality to compute |
| `max_paths` | `Optional[int]` | `1000000` | Maximum paths to consider (0 = all) |
| `participating_source_node_labels` | `Optional[List[str]]` | `None` | Source node labels |
| `participating_target_node_labels` | `Optional[List[str]]` | `None` | Target node labels |
| `participating_edge_labels` | `Optional[List[str]]` | `None` | Edge labels to traverse |
| `is_directional` | `Optional[bool]` | `True` | Whether edges are directional |
| `min_hop_count` | `Optional[int]` | `1` | Minimum hops |
| `max_hop_count` | `Optional[int]` | `4` | Maximum hops |
| `shortest_path` | `Optional[bool]` | `False` | Only shortest paths |
| `max_results` | `Optional[int]` | `500` | Maximum results |

**Example:**
```python
# Preferred: keyword arguments (works for all centrality types)
result = graph.centrality(
    centrality_type=CentralityType.Edge,  # or CentralityType.Node (default)
    participating_edge_labels=["accessed", "connected_to"],
    threshold=5,
    max_results=100
)

# DEPRECATED — will be removed in a future version. Use keyword arguments above.
from sentinel_graph.builders.query_input import CentralityQueryInput, CentralityType
result = graph.centrality(query_input=CentralityQueryInput(
    centrality_type=CentralityType.Edge,
    participating_edge_labels=["accessed"]
))
```

---

### RankedQueryInput

Input parameters for a ranked analysis query.
Inherits from `QueryInputBase`.

#### Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `rank_property_name` | `str` | *(required)* | Property name to use for ranking paths |
| `threshold` | `Optional[int]` | `0` | Only return paths with weights above this value |
| `max_paths` | `Optional[int]` | `1000000` | Maximum paths to consider (0 = all) |
| `decay_factor` | `Optional[float]` | `1` | How much each graph step reduces rank (2 = halves each step) |
| `is_directional` | `Optional[bool]` | `True` | Whether edges are directional |
| `min_hop_count` | `Optional[int]` | `1` | Minimum hops |
| `max_hop_count` | `Optional[int]` | `4` | Maximum hops |
| `shortest_path` | `Optional[bool]` | `False` | Only shortest paths |
| `max_results` | `Optional[int]` | `500` | Maximum results |

**Example:**
```python
# Preferred: keyword arguments
result = graph.ranked(
    rank_property_name="risk_score",
    threshold=5,
    decay_factor=2,
    max_results=50
)

# DEPRECATED — will be removed in a future version. Use keyword arguments above.
from sentinel_graph.builders.query_input import RankedQueryInput
result = graph.ranked(query_input=RankedQueryInput(
    rank_property_name="risk_score",
    threshold=5
))
```

---

## Query Results

### QueryResult

Result from a graph query with lazy DataFrame access.

#### Constructor

```python
QueryResult(raw_response: Dict[str, Any], graph: Graph)
```

**Parameters:**
- `raw_response` (Dict[str, Any]): Raw API response dictionary
- `graph` (Graph): Reference to parent Graph

**Note:** Typically created by `Graph.query()`, not directly instantiated.

#### Methods

##### `to_dataframe`

```python
def to_dataframe() -> DataFrame
```

Converts the query result to a Spark DataFrame.

**Returns:**
- `DataFrame`: Query result as Spark DataFrame

**Raises:**
- `ValueError`: If conversion fails

**Example:**
```python
result = graph.query("MATCH (u:user) RETURN u")
df = result.to_dataframe()
df.show()
```

##### `get_raw_data`

```python
def get_raw_data() -> Dict[str, Any]
```

Get RawData section from response.

**Returns:**
- `Dict[str, Any]`: Dictionary with raw metadata, or empty dict if not present

**Example:**
```python
result = graph.query("MATCH (u:user) RETURN u")
metadata = result.get_raw_data()
```

##### `show`

```python
def show(format: str = "visual") -> None
```

Display query result in various formats.

**Parameters:**
- `format` (str, default="visual"): Output format
  - `"table"`: Full DataFrame tables (all columns)
  - `"visual"`: Interactive graph visualization with VSC plugin
  - `"all"`: Show all formats

**Raises:**
- `ValueError`: If format isn't one of the supported values

**Example:**
```python
result = graph.query("MATCH (u:user)-[r:accessed]->(d:device) RETURN u, r, d")
result.show()  # Visual by default
result.show(format="table")  # Table format
```

---

## Complete Example (Recommended — v0.3+)

```python
# 0. Imports
from sentinel_graph import GraphSpecBuilder, Graph

# 1. Define graph specification
spec = (
    GraphSpecBuilder.start()
    
    .add_node("User")
        .from_dataframe(user_nodes)  # native Spark DF from groupBy → no .df
            .with_columns(
                "UserId", "UserDisplayName", "UserPrincipalName",
                "DistinctLocationCount", "DistinctIPCount", "DistinctAppCount",
                "TotalSignIns", "RiskySignInCount", "ImpossibleTravelFlag",
                key="UserId", display="UserDisplayName"
            )
    
    .add_node("IPAddress")
        .from_dataframe(ip_nodes)  # native Spark DF from groupBy → no .df
            .with_columns(
                "IPAddress", "UniqueUsers", "UniqueLocations",
                "SignInCount", "RiskySignInCount", "SharedIPFlag",
                key="IPAddress", display="IPAddress"
            )
    
    .add_edge("UsedIP")
        .from_dataframe(edge_used_ip)  # native Spark DF → no .df
            .source(id_column="UserId", node_type="User")
            .target(id_column="IPAddress", node_type="IPAddress")
            .with_columns(
                "SignInCount", "FirstSeen", "LastSeen", "EdgeKey",
                key="EdgeKey", display="EdgeKey"
            )
   
    .done()
)

# 2. Inspect schema before building (GraphSpec owns this)
spec.show_schema()

# 3. Build: prepares data + publishes graph → returns Graph
graph = Graph.build(spec)
print(f"Build status: {graph.build_status.status}")

# 4. Query the graph (query lives on Graph)
result = graph.query("MATCH (u:user)-[used:UsedIP]->(ip:IPAddress) RETURN * LIMIT 100")
result.show()

# 5. Access data via delegation
df = result.to_dataframe()
df.printSchema()

# 6. Graph algorithms
gf = graph.to_graphframe()
pagerank_result = gf.pageRank(resetProbability=0.15, maxIter=10)
pagerank_result.vertices.select("id", "pagerank").show()

# 7. Fetch an existing graph (no spec needed)
graph = Graph.get("my_existing_graph", context=context)
graph.query("MATCH (n) RETURN n LIMIT 10").show()
```


## Notes on Design Patterns

### Fluent API

All builders support method chaining for readable, declarative graph definitions:

```python
builder.add_node("user") \
    .from_table("Users") \
    .with_columns("id", "name", key="id", display="name") \
    .add_edge("follows")
```

### Restrictions

Builder support methods - add_node() and add_edge() does not allow use of underscores ('_') when naming nodes, edges or properties in a custom graph. Graph building operations will fail surfacing an invalid request error.

### Union Schemas

Multiple edges with the same alias are automatically union'ed with merged properties:

```python
# Both edges use alias "sign_in" - they will be merged into one schema edge
builder.add_edge("sign_in") \
    .from_table("AzureSignins") \
    .source(id_column="UserId", node_type="AZuser") \
    .target(id_column="DeviceId", node_type="device")

builder.add_edge("sign_in") \
    .from_table("EntraSignins") \
    .source(id_column="UserId", node_type="EntraUser") \
    .target(id_column="DeviceId", node_type="device")
```

### Autoconfiguration

Many fields have sensible defaults:
- Node/edge labels default to their aliases
- Properties are autoinferred from source schemas
- Entity groups default to primary labels/relationship types

### Lazy Evaluation

DataFrames and resources are loaded lazily and cached:
- `graph_spec.nodes` and `graph_spec.edges` are loaded on first access
- Query results create DataFrames only when requested


## Related content

- [Custom graphs overview](./custom-graphs-overview.md)
- [Create custom graphs](./create-custom-graphs.md)