import lodash from 'lodash';

var errors = {
    E000: '有効なエラーコードではありません',
    E001: '`<%= attribute %>`属性は禁止されています',
    E002: '属性名は次の形式と一致する必要があります:<%= format %>',
    E003: '属性が重複しています: <%= attribute %>',
    E004: '属性値に安全でない文字を含めないでください',
    E005: '`<%= attribute %>`属性は<%= format %>ではありません',
    E006: '属性値を空にすることはできません',
    E007: '<！DOCTYPE>は、最初に表示される要素である必要があります',
    E008: 'doctypeはHTML5標準に準拠する必要があります',
    E009: '<%= format %>リンクのみを使用する',
    E010: 'IDとクラスでは「ad」という単語を使用しないことがあります',
    E011: '値は次の形式と一致する必要があります。<%= format %>',
    E012: 'id "<%= id %>"は既に使用されています',
    E013: 'イメージタグに `alt`プロパティを設定する必要があります',
    E014: '`img`タグにsrc属性を指定する必要があります',
    E015: '行末が書式と一致しません：<%= format %>',
    E016: '<%= tag %>タグは禁止されています',
    E017: 'タグ名は小文字でなければなりません',
    E018: 'void要素は<%= expect %>自身を閉じます。',
    E019: 'すべてのラベルは `for`属性を持つべきです',
    E020: 'ラベルに `for`属性やラベルなしの子がありません',
    E021: 'id "<%= id %>"の要素は存在しません（ `for`属性と一致する必要があります）',
    E022: 'リンクされた要素はlabeableではありません（id：<%= id %>）',
    E023: '<%= part %> contains improperly escaped characters: <%= chars %>',
    E024: '<%= type %>は許可されていません',
    E025: 'html要素はページの言語を指定する必要があります',
    E026: '<%= op %>（ページ上のすべてのフォーカス可能な要素は、正のtabindexまたはnoneを持つ必要があります）',
    E027: '<head>タグにはタイトルが含まれていなければなりません',
    E028: '<head>タグには1つのタイトルしか含めることができません。 <%= num %>見つかりました',
    E029: 'タイトル "<%= title %>"が<%= maxlength %>の最大長を超えています',
    E030: 'タグの開始と終了は一致する必要があります',
    E031: '表にはアクセシビリティのためのキャプションが必要です',
    E032: '図形はfigcaptionを持っていなければなりません。figcaptionはFigure内になければなりません（アクセシビリティのために）',
    E033: 'id：<%= idValue %>（またはtypeがtextの場合、name：<%= nameValue %>）はアクセシビリティのラベルに関連付けられていません',
    E034: 'ラジオ入力には関連する名前が必要です',
    E035: '表にはアクセシビリティのためのヘッダーが必要です',
    E036: 'インデントスペースは<%= width %>のグループで使用する必要があります',
    E037: '1行の1つのタグの属性を<%= limit %>に制限する必要があります。',
    E038: 'lang属性<%= lang %>は無効です',
    E039: 'lang属性<%= lang %>が正しく大文字に変換されていません',
    E040: '行の長さは<%= maxlength %>文字を超えてはなりません（現在：<%= length %>）。',
    E041: '重複クラス：<%= classes %>',
    E042: 'タグが閉じていない',
    E043: '属性<%= attribute =>は<%= previous =>の前に来るべきです',
    E044: '<head>と<body>だけを<html>の子に指定することができます',
    E045: '<html>内のタグは重複してはいけません',
    E046: '<head>タグは<html>無いの<body>の前に来なければなりません',
    E047: '<head>で許可される唯一のタグはbase、link、meta、noscript、script、style、template、およびtitleです',
    E048: 'オプション<%= option %>の無効な値：<%= value =>'
};

class htmllintMessageJa {
    constructor() {
        this.errors = []
        lodash.forOwn(errors, (format, code) => {
            this.errors[code] = {
                format: format,
                code: code
            };
        });
    }
    renderMsg(code, data) {
        var format = errors[code];
        return lodash.template(format)(data);

    }

    renderIssue(issue) {
        var msg = "";
        try {
            msg = this.renderMsg(issue.code, issue.data)
        } catch(e){
            console.log(e);
        }
        return msg;
    }
}

export default new htmllintMessageJa()
