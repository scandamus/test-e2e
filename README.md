# test-e2e

テスト用のコンテナです。本体のコンテナ群とは分けました。
このテストに対応する最小限の変更を https://github.com/scandamus/ft_transcendence/pull/143 に上げました。
先に本体のdocker-compose upをした後でこちらのdocker-compose up --buildしてください。

### テストスクリプト
Mochaフレームワークを使っています。
実際のスクリプトはpackage.jsonで指定します。
```
"scripts": {
  "test:e2e": "mocha test_multiple_users.js"
}
```
サンプルで単純なユーザー登録、ログイン、ログアウト、ユーザー削除などを行うテストをおいておきます。
package.jsonに追記するとほかのスクリプトも走らせられます。
```
"scripts": {
  "test:e2e": "mocha test_multiple_users.js test_another_test.js"
}
```
試してませんがWebSocketでの接続も可能なはずです。
