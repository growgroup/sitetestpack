# SITE TEST PACK


## 背景

Webサイトのテスト工程において、デザインチェックや、SEO関連の設定、
コーディングルールへの対応など、とにかくチェックに時間がかかっている。

## 目的

業務フロー内のでWebサイトコーディングにおいて、以下の作業の時間短縮を目的としています。

* ページのURLリストの作成
* コーディングルールに沿っているかどうかの確認
* SEO設定の確認
* デザインチェックのためのスクリーンショットの自動生成

## 必要条件

* node >= 6.3.1
* npm >= 4.0.0

## インストール

```bash
git clone https://github.com/growgroup/sitetestpack.git
cd sitetestpack
npm install
npm run start
```

## 主な機能

* リンクの取得: 一つのURLを元に、サイト内のページリストを取得します。
* サイトチェック: 取得したページリストを元に、titleタグやmeta description, h1, h2, 電話番号(※ミスタイポがあると致命的なため), htmllint を通し、CSVに出力します。
* スクリーンショット: 取得したページリストを元に、スクリーンショットを生成します。内部的には pageres を利用しています。

## 使い方


プロンプトが起動しますので、質問事項にそって入力を進めてください。

完了後に、コマンドを打ったディレクトリ直下に ```sitetestpack_results``` ディレクトリを生成します。
