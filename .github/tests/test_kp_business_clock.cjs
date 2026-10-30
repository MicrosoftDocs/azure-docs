const test = require('node:test');
const assert = require('node:assert/strict');
const {isDue, reconcile, readClock, canPost, PREFIX} = require('../scripts/kp-business-clock.cjs');

test('72 elapsed Redmond weekday hours, not office hours or calendar-date counting', () => {
  const due = (start, end) => isDue(start, Date.parse(end), 3);
  // Friday noon PDT -> Wednesday noon PDT; the entire weekend is excluded.
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-26T19:00:00Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T18:59:59Z'), false);
  assert.equal(due('2026-10-23T19:00:00Z', '2026-10-28T19:00:00Z'), true);
  // UTC Saturday is still Friday evening in Redmond.
  assert.equal(due('2026-10-24T06:00:00Z', '2026-10-29T06:00:00Z'), true);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T06:59:59Z'), false);
  assert.equal(due('2026-10-24T07:00:00Z', '2026-10-29T07:00:00Z'), true);
  // DST changes on the excluded Sunday: local deadline remains Wednesday noon.
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T18:59:59Z'), false);
  assert.equal(due('2026-03-06T20:00:00Z', '2026-03-11T19:00:00Z'), true);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T19:59:59Z'), false);
  assert.equal(due('2026-10-30T19:00:00Z', '2026-11-04T20:00:00Z'), true);
  assert.equal(due('2026-10-28T19:00:00Z', '2026-10-27T19:00:00Z'), false);
  assert.throws(() => due('invalid', '2026-10-28T19:00:00Z'), /Invalid/);
  assert.throws(() => isDue('2026-10-23T19:00:00Z', Date.now(), -1), /Invalid/);
});

function fixture() {
  Object.assign(process.env, {
    EVENT_LABEL: 'conference-event', REMINDER_DUE_LABEL: 'kp-reminder-due',
    AUTHOR_REMINDER_LABEL: 'kp-author-stalepr', EXEMPT_LABEL: 'keep-open',
    AUTHOR_REMINDER_MESSAGE: 'Existing author reminder', INACTIVITY_DAYS: '3'
  });
  let now = Date.parse('2026-10-26T19:00:00Z');
  const comments = [], events = [], reviews = [], writes = [];
  const pr = {number: 42, state: 'open', draft: false, title: 'Title', body: 'Body',
    head: {sha: 'abc'}, base: {ref: 'release-ignite26-test'},
    created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z', labels: [{name: 'conference-event'}],
    assignees: [], requested_reviewers: [], requested_teams: []};
  const stamp = () => new Date(now += 1000).toISOString();
  function label(name, add) {
    pr.labels = pr.labels.filter(item => item.name !== name);
    if (add) pr.labels.push({name});
    pr.updated_at = stamp();
    events.push({event: add ? 'labeled' : 'unlabeled', label: {name},
      actor: {login: 'github-actions[bot]'}, created_at: pr.updated_at});
    writes.push([add ? 'add' : 'remove', name]);
  }
  const get = async () => ({data: structuredClone(pr)});
  const endpoints = {
    list: () => {}, get,
    listComments: () => {}, listEventsForTimeline: () => {}, listReviewComments: () => {},
    getLabel: async () => ({data: {name: 'kp-reminder-due'}}),
    createComment: async ({body}) => {
      const comment = {id: comments.length + 1, body, user: {login: 'github-actions[bot]'},
        created_at: stamp()};
      comment.updated_at = comment.created_at;
      comments.push(comment); pr.updated_at = comment.updated_at;
      writes.push(['comment', body]);
      return {data: structuredClone(comment)};
    },
    updateComment: async ({comment_id, body}) => {
      const comment = comments.find(item => item.id === comment_id);
      comment.body = body; comment.updated_at = stamp(); pr.updated_at = comment.updated_at;
      writes.push(['update', body]);
      return {data: structuredClone(comment)};
    },
    addLabels: async ({labels}) => {for (const name of labels) label(name, true);},
    removeLabel: async ({name}) => label(name, false)
  };
  const paginate = async endpoint => structuredClone(
    endpoint === endpoints.listComments ? comments : endpoint === endpoints.listReviewComments ? reviews : events);
  paginate.iterator = async function* () {yield {data: [structuredClone(pr)]};};
  const github = {graphql: async (query, params) => {
    assert.ok(query.includes('lastEditedAt'));
    assert.equal(params.owner, 'test');
    assert.equal(params.repo, 'repo');
    assert.equal(params.number, 42);
    return {repository: {pullRequest: {lastEditedAt: pr.lastEditedAt ?? null,
      reviews: {nodes: [], pageInfo: {hasNextPage: false, endCursor: null}}}}};
  }, rest: {pulls: {list: endpoints.list, get, listReviewComments: endpoints.listReviewComments},
    issues: endpoints}, paginate};
  const run = () => reconcile({github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, now});
  return {pr, comments, events, reviews, writes, github, run, label,
    setTime: value => {now = Date.parse(value);},
    humanComment: () => {
      pr.updated_at = stamp();
      comments.push({id: comments.length + 1, body: 'Author activity',
        user: {login: 'author'}, created_at: pr.updated_at, updated_at: pr.updated_at});
    }};
}

test('initialization, due bookkeeping, stock reminder, activity cleanup and reset', async () => {
  const f = fixture();
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), true);
  // Represent stock stale's comment-then-marker writes, not a custom commenter.
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  f.label('kp-author-stalepr', true);
  const count = f.writes.length;
  await f.run();
  assert.equal(f.writes.length, count, 'bookkeeping must not rewrite the clock or due label');
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  f.setTime('2026-10-29T20:00:00Z');
  f.humanComment();
  const activityAt = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-author-stalepr'), true);
  // The marker itself keeps the PR in stock stale's any-of label filter.
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  const resetWrites = f.writes.length;
  await f.run();
  assert.equal(f.writes.length, resetWrites, 'cleanup and due removal must not restart the clock');
  assert.equal(readClock(f.comments[0]).activityAt, activityAt);
});

test('body/commit/label changes reset; drafts/exemptions and absent membership never become due', async () => {
  for (const change of [
    f => {f.pr.body = 'Edited';},
    f => {f.pr.head.sha = 'def';},
    f => {f.pr.labels.push({name: 'human-label'});}
  ]) {
    const f = fixture();
    await f.run();
    change(f); f.pr.updated_at = '2026-10-27T21:00:00Z';
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T21:00:00Z');
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
  for (const change of [
    f => {f.pr.draft = true;},
    f => {f.pr.labels.push({name: 'keep-open'});},
    f => {f.pr.labels = [];}
  ]) {
    const f = fixture(); change(f);
    f.setTime('2026-11-10T20:00:00Z');
    await f.run();
    assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  }
});

test('untrusted clocks ignored, invalid bot state and API failures fail explicitly', async () => {
  const f = fixture();
  f.comments.push({id: 99, body: PREFIX + '{}\n-->', user: {login: 'author'}});
  await f.run();
  assert.equal(f.comments.length, 2);
  f.comments[1].body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  const g = fixture();
  g.github.rest.issues.getLabel = async () => {throw new Error('Missing required label');};
  await assert.rejects(g.run(), /Missing required label/);
  assert.equal(g.writes.length, 0);
  const h = fixture();
  await h.run();
  h.comments.push({...h.comments[0], id: 100, body: PREFIX + '{}\n-->'});
  await assert.rejects(h.run(), /Invalid persisted/);
});

test('recover activity before later bot writes, including edited old comments', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.setTime('2026-10-29T19:00:00Z');
  f.humanComment();
  const human = f.comments.at(-1);
  f.label('kp-author-stalepr', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  f.setTime('2026-10-30T19:00:00Z');
  human.updated_at = '2026-10-30T19:00:00Z';
  f.pr.updated_at = human.updated_at;
  f.label('kp-author-stalepr', false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, human.updated_at);
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
});

test('an existing marker without due is not disturbed to force a reminder', async () => {
  const f = fixture();
  f.pr.labels.push({name: 'kp-author-stalepr'});
  f.setTime('2026-11-10T20:00:00Z');
  await f.run();
  assert.equal(f.pr.labels.some(l => l.name === 'kp-reminder-due'), false);
  assert.equal(f.writes.some(([kind]) => kind === 'add' || kind === 'remove'), false);
});

test('clock writes cannot hide racing author activity', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T18:00:00Z';
      f.setTime('2026-10-27T19:00:00Z');
    }
    const original = f.github.rest.issues[method];
    let humanAt;
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      humanAt = f.pr.updated_at;
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const clock = f.comments.find(comment => comment.body.startsWith(PREFIX));
    assert.equal(readClock(clock).activityAt, humanAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting rereads activity and prevents stale eligibility from sending', async () => {
  for (const change of ['none', 'comment', 'push', 'body', 'draft', 'keep-open', 'retarget', 'during-read']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    if (change === 'comment') f.humanComment();
    if (change === 'push') f.pr.head.sha = 'new-commit';
    if (change === 'body') f.pr.body = 'New body';
    if (change === 'draft') f.pr.draft = true;
    if (change === 'keep-open') f.label('keep-open', true);
    if (change === 'retarget') f.pr.base.ref = 'main';
    if (change === 'during-read') {
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) f.humanComment();
        return get(args);
      };
    }
    const allowed = await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    });
    assert.equal(allowed, change === 'none', change);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
      change === 'none' || change === 'during-read', change);
  }
});

test('posting rejects activity racing clock creation and update in that same pass', async () => {
  for (const method of ['createComment', 'updateComment']) {
    const f = fixture();
    if (method === 'updateComment') {
      await f.run();
      f.pr.body = 'Edited body';
      f.pr.updated_at = '2026-10-27T19:00:00Z';
    }
    f.setTime('2026-10-30T20:01:00Z');
    const original = f.github.rest.issues[method];
    f.github.rest.issues[method] = async args => {
      f.humanComment();
      f.github.rest.issues[method] = original;
      return original(args);
    };
    await f.run();
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T20:02:00Z')
    }), false);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('posting fails explicitly on missing/duplicate clocks and API errors', async () => {
  for (const problem of ['missing', 'duplicate', 'api']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    if (problem === 'missing') f.comments.length = 0;
    if (problem === 'duplicate') f.comments.push(structuredClone(f.comments[0]));
    if (problem === 'api') f.github.rest.pulls.get = async () => {throw Error('Read failed');};
    await assert.rejects(canPost({
      github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
    }), problem === 'api' ? /Read failed/ : problem === 'duplicate' ? /Invalid KP clock comment identity/ : /Expected one KP clock/);
  }
});

test('posting detects same-second issue and review comment count changes', async () => {
  for (const field of ['comments', 'review_comments']) {
    for (const delta of [0, 1, -1]) {
      const f = fixture();
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      f.pr.comments = 10;
      f.pr.review_comments = 5;
      const timestamp = f.pr.updated_at;
      const get = f.github.rest.pulls.get;
      let reads = 0;
      f.github.rest.pulls.get = async args => {
        if (++reads === 2) {
          f.pr[field] += delta;
          assert.equal(f.pr.updated_at, timestamp, 'the race must not rely on a new timestamp');
        }
        return get(args);
      };
      const allowed = await canPost({
        github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
        core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')
      });
      assert.equal(allowed, delta === 0, field + ':' + delta);
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'),
        'unstable snapshots must leave bookkeeping for the next reconciliation');
    }
  }
});

test('review replies and edited inline feedback survive later bookkeeping', async () => {
  for (const edited of [false, true]) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    const feedbackAt = '2026-10-28T19:01:00Z';
    f.reviews.push({id: 100, body: 'Review feedback', user: {login: 'reviewer'},
      created_at: edited ? '2026-10-23T19:00:00Z' : feedbackAt, updated_at: feedbackAt});
    f.label('kp-reminder-due', true);
    const seen = [];
    const paginate = f.github.paginate;
    const read = async (endpoint, args) => {
      if (endpoint === f.github.rest.pulls.listReviewComments) seen.push(args);
      return paginate(endpoint, args);
    };
    read.iterator = paginate.iterator;
    f.github.paginate = read;
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, feedbackAt);
    assert.ok(seen.length >= 2);
    assert.ok(seen.every(args => args.per_page === 100 && args.pull_number === 42));
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  }
});

test('enrollment preserves idle time before writing the event label', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']};
  await initialize(args);
  f.label('conference-event', true);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  const count = f.comments.length;
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.length, count);
  const g = fixture();
  g.github.rest.issues.createComment = async () => {throw Error('Clock write denied');};
  await assert.rejects(initialize({...args, github: g.github}), /Clock write denied/);
  assert.equal(g.writes.length, 0);
});

test('bot timestamp skew does not reset activity; review read failures remain errors', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  f.label('kp-author-stalepr', true);
  f.pr.updated_at = '2026-10-28T19:01:03Z';
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-23T19:00:00Z');
  const paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Review access denied');
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await assert.rejects(f.run(), /Review access denied/);
});

test('commit metadata never advances activity beyond the server-observed push', async () => {
  for (const date of ['2099-01-01T00:00:00Z', '2000-01-01T00:00:00Z']) {
    const f = fixture();
    await f.run();
    f.pr.head.sha = 'pushed-head';
    f.pr.updated_at = '2026-10-27T19:00:00Z';
    f.events.push({event: 'committed', committer: {date}, author: {date},
      created_at: date});
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    f.setTime('2026-10-30T19:00:00Z');
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, '2026-10-27T19:00:00Z');
    assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-30T19:02:00Z')}), true);
  }
});

test('overlapping enrollment and backfill share the oldest trusted clock without deleting comments', async () => {
  const {initialize} = require('../scripts/kp-business-clock.cjs');
  const f = fixture();
  f.pr.labels = [];
  f.setTime('2026-10-28T19:01:00Z');
  const args = {github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, pr: structuredClone(f.pr),
    eventLabel: 'conference-event', managedLabels: ['kp-reminder-due', 'kp-author-stalepr']};
  const paginate = f.github.paginate;
  let release, reads = 0;
  const barrier = new Promise(resolve => {release = resolve;});
  const read = async (endpoint, params) => {
    if (endpoint !== f.github.rest.issues.listComments) return paginate(endpoint, params);
    const snapshot = await paginate(endpoint, params);
    if (++reads === 2) release();
    await barrier;
    return snapshot;
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await Promise.all([initialize(args), initialize(args)]);
  assert.equal(f.comments.length, 2, 'both initializers must observe an empty snapshot');
  const oldest = f.comments[0], duplicate = f.comments[1];
  const duplicateBody = duplicate.body;
  f.comments.reverse();
  f.github.paginate = paginate;
  f.label('conference-event', true);
  await f.run();
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
  assert.equal(readClock(oldest).activityAt, '2026-10-23T19:00:00Z');
  assert.equal(await canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), true);
  f.humanComment();
  const latest = f.pr.updated_at;
  await f.run();
  assert.equal(readClock(oldest).activityAt, latest);
  assert.equal(duplicate.body, duplicateBody);
  await initialize({...args, pr: structuredClone(f.pr)});
  assert.equal(f.comments.filter(comment => comment.body.startsWith(PREFIX)).length, 2);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  duplicate.body = PREFIX + '{}\n-->';
  await assert.rejects(f.run(), /Invalid persisted/);
  await assert.rejects(initialize(args), /Invalid persisted/);
  await assert.rejects(canPost({github: f.github, context: args.context, core: args.core,
    number: 42, now: Date.parse('2026-10-28T19:02:00Z')}), /Invalid persisted/);
});

test('restored PR descriptions retain server edit activity through later bot writes', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const original = f.pr.body;
  f.pr.body = 'Temporary description edit';
  f.pr.body = original;
  f.pr.lastEditedAt = '2026-10-28T19:01:30Z';
  f.pr.updated_at = f.pr.lastEditedAt;
  f.setTime('2026-10-28T19:02:00Z');
  f.label('kp-author-stalepr', true);
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, f.pr.lastEditedAt);
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
  f.github.graphql = async () => {throw Error('Edit activity access denied');};
  await assert.rejects(f.run(), /Edit activity access denied/);
  f.github.graphql = async () => ({repository: {pullRequest: null}});
  await assert.rejects(f.run(), /Missing or invalid server PR edit time/);
});

test('existing enrollment without a clock conservatively retains latest PR activity', async () => {
  const f = fixture();
  f.events.push({event: 'labeled', label: {name: 'conference-event'},
    actor: {login: 'github-actions[bot]'}, created_at: '2026-10-24T19:00:00Z'});
  f.pr.updated_at = '2026-10-28T18:00:00Z';
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, '2026-10-28T18:00:00Z');
  assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
});

test('edited submitted review summaries reset inactivity across all GraphQL pages', async () => {
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  const editedAt = '2026-10-28T19:01:30Z';
  const after = [];
  f.github.graphql = async (query, params) => {
    after.push(params.after);
    return {repository: {pullRequest: {lastEditedAt: null, reviews: {
      nodes: params.after ? [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: editedAt}]
        : [{submittedAt: '2026-10-23T19:00:00Z', lastEditedAt: null}],
      pageInfo: {hasNextPage: !params.after, endCursor: params.after ? null : 'review-page-2'}
    }}}};
  };
  assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
  await f.run();
  assert.equal(readClock(f.comments[0]).activityAt, editedAt);
  assert.ok(after.includes(null) && after.includes('review-page-2'));
  const writes = f.writes.length;
  for (const problem of ['denied', 'missing', 'repeat', 'timestamp']) {
    f.github.graphql = async () => {
      if (problem === 'denied') throw Error('Review summary read denied');
      return {repository: {pullRequest: {lastEditedAt: null, reviews: problem === 'missing' ? null : {
        nodes: problem === 'timestamp' ? [{submittedAt: 'invalid', lastEditedAt: null}] : [],
        pageInfo: {hasNextPage: true, endCursor: 'repeated'}
      }}}};
    };
    await assert.rejects(f.run(), /Review summary read denied|Missing review-summary|Invalid review-summary/);
    assert.equal(f.writes.length, writes);
  }
});

test('posting persists observed push and body activity before removing its due label', async () => {
  for (const change of ['push', 'body']) {
    const f = fixture();
    await f.run();
    f.setTime('2026-10-28T19:01:00Z');
    await f.run();
    if (change === 'push') f.pr.head.sha = 'new-push';
    else f.pr.body = 'New description';
    const activityAt = '2026-10-28T19:01:30Z';
    f.pr.updated_at = activityAt;
    f.setTime('2026-10-28T19:02:00Z');
    assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
      core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), false);
    assert.equal(readClock(f.comments[0]).activityAt, activityAt);
    assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
    await f.run();
    assert.equal(readClock(f.comments[0]).activityAt, activityAt, 'bot removals must not restart inactivity');
  }
  const f = fixture();
  await f.run();
  f.setTime('2026-10-28T19:01:00Z');
  await f.run();
  f.pr.head.sha = 'new-push';
  f.pr.updated_at = '2026-10-28T19:01:30Z';
  f.github.rest.issues.updateComment = async () => {throw Error('Clock persistence denied');};
  await assert.rejects(canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
    core: {info() {}}, number: 42, now: Date.parse('2026-10-28T19:03:00Z')}), /Clock persistence denied/);
  assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
});

test('deleted issue and inline comments reset from observation even with equal replacement counts', async () => {
  for (const kind of ['issue', 'review']) {
    for (const posting of [false, true]) {
      const f = fixture();
      const entries = kind === 'issue' ? f.comments : f.reviews;
      entries.push({id: 500, body: 'Old feedback', user: {login: 'reviewer'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      await f.run();
      f.setTime('2026-10-28T19:01:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
      entries.splice(entries.findIndex(item => item.id === 500), 1);
      entries.push({id: 501, body: 'Replacement feedback', user: {login: 'reviewer'},
        created_at: '2026-10-23T19:00:00Z', updated_at: '2026-10-23T19:00:00Z'});
      const observedAt = '2026-10-28T19:02:00.000Z';
      f.setTime(observedAt);
      if (posting) {
        assert.equal(await canPost({github: f.github, context: {repo: {owner: 'test', repo: 'repo'}},
          core: {info() {}}, number: 42, now: Date.parse(observedAt)}), false);
      } else await f.run();
      const clock = f.comments.find(item => item.body.startsWith(PREFIX));
      assert.equal(readClock(clock).activityAt, observedAt);
      assert.deepEqual(readClock(clock).commentIds[kind], [501]);
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-10-29T19:02:00Z');
      await f.run();
      assert.equal(readClock(clock).activityAt, observedAt, 'unchanged snapshots and bookkeeping do not reset again');
      f.setTime('2026-11-02T20:01:59Z');
      await f.run();
      assert.equal(f.pr.labels.some(label => label.name === 'kp-reminder-due'), false);
      f.setTime('2026-11-02T20:02:00Z');
      await f.run();
      assert.ok(f.pr.labels.some(label => label.name === 'kp-reminder-due'));
    }
  }
});

test('comment identity baselines migrate without resetting and reject incomplete or malformed state', async () => {
  const f = fixture();
  await f.run();
  const clock = f.comments[0], legacy = readClock(clock);
  delete legacy.commentIds;
  clock.body = PREFIX + JSON.stringify(legacy) + '\n-->';
  const feedback = Array.from({length: 205}, (_, index) => ({id: 500 + index,
    body: 'Feedback', user: {login: 'reviewer'}, updated_at: '2026-10-23T19:00:00Z'}));
  f.comments.push(...feedback);
  const seen = [], paginate = f.github.paginate;
  const read = async (endpoint, args) => {
    seen.push([endpoint, args.per_page]);
    return paginate(endpoint, args);
  };
  read.iterator = paginate.iterator;
  f.github.paginate = read;
  await f.run();
  assert.equal(readClock(clock).activityAt, legacy.activityAt);
  assert.equal(readClock(clock).commentIds.issue.length, 205);
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.issues.listComments && size === 100));
  assert.ok(seen.some(([endpoint, size]) => endpoint === f.github.rest.pulls.listReviewComments && size === 100));
  const activityAt = readClock(clock).activityAt;
  f.comments.reverse();
  await f.github.rest.issues.createComment({body: process.env.AUTHOR_REMINDER_MESSAGE});
  await f.run();
  const writes = f.writes.length;
  f.comments.splice(f.comments.findIndex(item => item.body === process.env.AUTHOR_REMINDER_MESSAGE), 1);
  await f.run();
  assert.equal(readClock(clock).activityAt, activityAt);
  assert.equal(f.writes.length, writes, 'stock reminder deletion is not human activity');
  const valid = clock.body;
  for (const commentIds of [null, {}, {issue: [2, 1], review: []},
    {issue: [1, 1], review: []}, {issue: ['1'], review: []},
    {issue: [Number.MAX_SAFE_INTEGER + 1], review: []}]) {
    clock.body = PREFIX + JSON.stringify({...readClock({body: valid}), commentIds}) + '\n-->';
    await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
    assert.equal(f.writes.length, writes);
  }
  clock.body = valid;
  feedback[0].id = 0;
  await assert.rejects(f.run(), /Invalid persisted KP comment identities/);
  assert.equal(f.writes.length, writes);
  feedback[0].id = 500;
  f.github.paginate = Object.assign(async endpoint => {
    if (endpoint === f.github.rest.pulls.listReviewComments) throw Error('Comment snapshot read denied');
    return paginate(endpoint);
  }, {iterator: paginate.iterator});
  await assert.rejects(f.run(), /Comment snapshot read denied/);
  assert.equal(f.writes.length, writes);
});
