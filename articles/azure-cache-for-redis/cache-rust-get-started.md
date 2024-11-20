---
title: 'Quickstart: Use Azure Cache for Redis with Rust'
description: Modify a sample Rust app and connect the app to Azure Cache for Redis.



ms.devlang: rust
ms.topic: quickstart
ms.date: 01/08/2021
ms.custom: mode-other
#Customer intent: As a Rust developer who is new to Azure Cache for Redis, I want to create a new Rust app that uses Azure Cache for Redis.
---

# Quickstart: Use Azure Cache for Redis with a Rust app

In this quickstart, you learn how to use the [Rust programming language](https://www.rust-lang.org/) to interact with [Azure Cache for Redis](./cache-overview.md). You also learn about commonly used Redis data structures:

* [String](https://redis.io/topics/data-types-intro#redis-strings)
* [Hash](https://redis.io/topics/data-types-intro#redis-hashes)
* [List](https://redis.io/topics/data-types-intro#redis-lists)

You start with a sample app and use the [redis-rs](https://github.com/mitsuhiko/redis-rs) library for Redis. The client exposes both high-level and low-level APIs, and you see both of these styles in action.

## Skip to the code

This article describes how to modify the code for a sample app to create a working app that connects to Azure Cache for Redis.

If you want to go straight to the code, see the [Rust quickstart sample](https://github.com/Azure-Samples/azure-redis-cache-rust-quickstart/) on GitHub.

## Prerequisites

* An Azure subscription. [Create one for free](https://azure.microsoft.com/free/)
* [Rust](https://www.rust-lang.org/tools/install) (version 1.39 or later)
* [Git](https://git-scm.com/downloads)

## Create a cache

[!INCLUDE [redis-cache-create](~/reusable-content/ce-skilling/azure/includes/azure-cache-for-redis/includes/redis-cache-create.md)]

[!INCLUDE [redis-cache-create](includes/redis-cache-access-keys.md)]

## Review the code (optional)

If you're interested in learning how the code works, you can review the following snippets. Otherwise, feel free to skip ahead to [Run the application](#run-the-application).

The `connect` function is used to establish a connection to Azure Cache for Redis. It expects the host name and the password (the access key) to be passed in via environment variables `REDIS_HOSTNAME` and `REDIS_PASSWORD` respectively. The format for the connection URL is `rediss://<username>:<password>@<hostname>`. Azure Cache for Redis accepts only secure connections. The minimum required version is [TLS 1.2](cache-remove-tls-10-11.md).

The call to [redis::Client::open](https://docs.rs/redis/0.19.0/redis/struct.Client.html#method.open) does basic validation, and [get_connection()](https://docs.rs/redis/0.19.0/redis/struct.Client.html#method.get_connection) actually starts the connection. The program stops if the connectivity fails for any reason. For example, it fails if an incorrect password is used.

```rust
fn connect() -> redis::Connection {
    let redis_host_name =
        env::var("REDIS_HOSTNAME").expect("missing environment variable REDIS_HOSTNAME");
    let redis_password =
        env::var("REDIS_PASSWORD").expect("missing environment variable REDIS_PASSWORD");
    let redis_conn_url = format!("rediss://:{}@{}", redis_password, redis_host_name);

    redis::Client::open(redis_conn_url)
        .expect("invalid connection URL")
        .get_connection()
        .expect("failed to connect to redis")
}
```

The `basics` function covers the [SET](https://redis.io/commands/set), [GET](https://redis.io/commands/get), and [INCR](https://redis.io/commands/incr) commands.

The low-level API is used for the `SET` and `GET` commands, which set and retrieve the value for a key named `foo`.

The `INCRBY` command is executed by using a high-level API. The [incr](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.incr) method increments the value of a key (named `counter`) by `2` followed by a call to [get](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.get) to retrieve it.

```rust
fn basics() {
    let mut conn = connect();
    let _: () = redis::cmd("SET")
        .arg("foo")
        .arg("bar")
        .query(&mut conn)
        .expect("failed to execute SET for 'foo'");

    let bar: String = redis::cmd("GET")
        .arg("foo")
        .query(&mut conn)
        .expect("failed to execute GET for 'foo'");
    println!("value for 'foo' = {}", bar);

    let _: () = conn
        .incr("counter", 2)
        .expect("failed to execute INCR for 'counter'");
    let val: i32 = conn
        .get("counter")
        .expect("failed to execute GET for 'counter'");
    println!("counter = {}", val);
}
```

The following code snippet demonstrates the functionality of a Redis `HASH` data structure. [HSET](https://redis.io/commands/hset) is invoked by using the low-level API to store information (`name`, `version`, `repo`) about Redis drivers (clients). For example, details for the Rust driver (the one that's used in this sample code) are captured in the form of a [BTreeMap](https://doc.rust-lang.org/std/collections/struct.BTreeMap.html). Then, the details are passed on to the low-level API. Finally, you retrieve the details by using [HGETALL](https://redis.io/commands/hgetall).

`HSET` can also be executed by using a high-level API. [hset_multiple](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.hset_multiple) accepts an array of tuples. [hget](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.hget) is then executed to fetch the value for a single attribute (the value for `repo`, in this case).

```rust
fn hash() {
    let mut conn = connect();

    let mut driver: BTreeMap<String, String> = BTreeMap::new();
    let prefix = "redis-driver";
    driver.insert(String::from("name"), String::from("redis-rs"));
    driver.insert(String::from("version"), String::from("0.19.0"));
    driver.insert(
        String::from("repo"),
        String::from("https://github.com/mitsuhiko/redis-rs"),
    );

    let _: () = redis::cmd("HSET")
        .arg(format!("{}:{}", prefix, "rust"))
        .arg(driver)
        .query(&mut conn)
        .expect("failed to execute HSET");

    let info: BTreeMap<String, String> = redis::cmd("HGETALL")
        .arg(format!("{}:{}", prefix, "rust"))
        .query(&mut conn)
        .expect("failed to execute HGETALL");
    println!("info for rust redis driver: {:?}", info);

    let _: () = conn
        .hset_multiple(
            format!("{}:{}", prefix, "go"),
            &[
                ("name", "go-redis"),
                ("version", "8.4.6"),
                ("repo", "https://github.com/go-redis/redis"),
            ],
        )
        .expect("failed to execute HSET");

    let repo_name: String = conn
        .hget(format!("{}:{}", prefix, "go"), "repo")
        .expect("HGET failed");
    println!("go redis driver repo name: {:?}", repo_name);
}
```

In the following function, you can see how to use a `LIST` data structure. [LPUSH](https://redis.io/commands/lpush) is executed (with the low-level API) to add an entry to the list. The high-level [lpop](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.lpop) method is used to retrieve that entry from the list. Then, the [rpush](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.rpush) method is used to add a couple of entries to the list, which are then fetched by using the low-level [lrange](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.lrange) method.

```rust
fn list() {
    let mut conn = connect();
    let list_name = "items";

    let _: () = redis::cmd("LPUSH")
        .arg(list_name)
        .arg("item-1")
        .query(&mut conn)
        .expect("failed to execute LPUSH for 'items'");

    let item: String = conn
        .lpop(list_name)
        .expect("failed to execute LPOP for 'items'");
    println!("first item: {}", item);

    let _: () = conn.rpush(list_name, "item-2").expect("RPUSH failed");
    let _: () = conn.rpush(list_name, "item-3").expect("RPUSH failed");

    let len: isize = conn
        .llen(list_name)
        .expect("failed to execute LLEN for 'items'");
    println!("no. of items in list = {}", len);

    let items: Vec<String> = conn
        .lrange(list_name, 0, len - 1)
        .expect("failed to execute LRANGE for 'items'");

    println!("listing items in list");
    for item in items {
        println!("item: {}", item)
    }
}
```

Here you can see some of the `SET` operations. The [sadd](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.sadd) (high-level API) method adds a couple entries to a `SET` named `users`. [SISMEMBER](https://redis.io/commands/hset) is then executed (low-level API) to check whether `user1` exists. Finally, [smembers](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.smembers) is used to fetch and iterate over all the set entries in the form of a Vector ([Vec\<String\>](https://doc.rust-lang.org/std/vec/struct.Vec.html)).

```rust
fn set() {
    let mut conn = connect();
    let set_name = "users";

    let _: () = conn
        .sadd(set_name, "user1")
        .expect("failed to execute SADD for 'users'");
    let _: () = conn
        .sadd(set_name, "user2")
        .expect("failed to execute SADD for 'users'");

    let ismember: bool = redis::cmd("SISMEMBER")
        .arg(set_name)
        .arg("user1")
        .query(&mut conn)
        .expect("failed to execute SISMEMBER for 'users'");
    println!("does user1 exist in the set? {}", ismember);

    let users: Vec<String> = conn.smembers(set_name).expect("failed to execute SMEMBERS");
    println!("listing users in set");

    for user in users {
        println!("user: {}", user)
    }
}
```

The `sorted_set` function demonstrates the Sorted Set data structure. [ZADD](https://redis.io/commands/zadd) is invoked with the low-level API to add a random integer score for a player (`player-1`). Next, the [zadd](https://docs.rs/redis/0.19.0/redis/trait.Commands.html#method.zadd) method (high-level API) is used to add more players (`player-2` to `player-5`) and their respective scores, which are randomly generated. The number of entries in the sorted set is determined by using [ZCARD](https://redis.io/commands/zcard). That number is the limit to the [ZRANGE](https://redis.io/commands/zrange) command (invoked with the low-level API) to list out the players with their scores in ascending order.

```rust
fn sorted_set() {
    let mut conn = connect();
    let sorted_set = "leaderboard";

    let _: () = redis::cmd("ZADD")
        .arg(sorted_set)
        .arg(rand::thread_rng().gen_range(1..10))
        .arg("player-1")
        .query(&mut conn)
        .expect("failed to execute ZADD for 'leaderboard'");

    for num in 2..=5 {
        let _: () = conn
            .zadd(
                sorted_set,
                String::from("player-") + &num.to_string(),
                rand::thread_rng().gen_range(1..10),
            )
            .expect("failed to execute ZADD for 'leaderboard'");
    }

    let count: isize = conn
        .zcard(sorted_set)
        .expect("failed to execute ZCARD for 'leaderboard'");

    let leaderboard: Vec<(String, isize)> = conn
        .zrange_withscores(sorted_set, 0, count - 1)
        .expect("ZRANGE failed");

    println!("listing players and scores in ascending order");

    for item in leaderboard {
        println!("{} = {}", item.0, item.1)
    }
}
```

## Clone the sample application

Start by cloning the application repository on GitHub.

1. In a Command Prompt window, create a folder named *git-samples*.

    ```bash
    md "C:\git-samples"
    ```

1. Open a git terminal window, like in Git Bash. Use the `cd` command to go to the new folder where you will clone the sample app.

    ```bash
    cd "C:\git-samples"
    ```

1. Run the following command to clone the samples repository. This command creates a copy of the sample app on your computer.

    ```bash
    git clone https://github.com/Azure-Samples/azure-redis-cache-rust-quickstart.git
    ```

## Run the application

The application accepts connectivity and credentials in the form of environment variables.

1. In the [Azure portal](https://portal.azure.com/), get the host name and access key for the Azure Cache for Redis instance.

1. Set the values to the respective environment variables:

    ```shell
    set REDIS_HOSTNAME=<Host name>:<port> (for example, <name of cache>.redis.cache.windows.net:6380)
    set REDIS_PASSWORD=<Primary Access Key>
    ```

1. In the terminal window, go to the relevant folder.

   For example:

    ```shell
    cd "C:\git-samples\azure-redis-cache-rust-quickstart"
    ```

1. In the terminal, run the following command to start the application:

    ```shell
    cargo run
    ```

    The output looks similar to this example:

    ```bash
    ******* Running SET, GET, INCR commands *******
    value for 'foo' = bar
    counter = 2
    ******* Running HASH commands *******
    info for rust redis driver: {"name": "redis-rs", "repo": "https://github.com/mitsuhiko/redis-rs", "version": "0.19.0"}
    go redis driver repo name: "https://github.com/go-redis/redis"
    ******* Running LIST commands *******
    first item: item-1
    no. of items in list = 2
    listing items in list
    item: item-2
    item: item-3
    ******* Running SET commands *******
    does user1 exist in the set? true
    listing users in set
    user: user2
    user: user1
    user: user3
    ******* Running SORTED SET commands *******
    listing players and scores
    player-2 = 2
    player-4 = 4
    player-1 = 7
    player-5 = 6
    player-3 = 8
    ```

    If you want to run a specific function, comment-out other functions inside the `main` function:

    ```rust
    fn main() {
        basics();
        hash();
        list();
        set();
        sorted_set();
    }
    ```

<!-- Clean up include -->

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

* [Create a basic ASP.NET web app that uses Azure Cache for Redis](./cache-web-app-howto.md)
