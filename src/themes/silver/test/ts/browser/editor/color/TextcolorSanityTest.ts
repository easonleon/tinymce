import { ApproxStructure, Pipeline, Log } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { TinyApis, TinyLoader, TinyUi } from '@ephox/mcagar';
import Env from 'tinymce/core/api/Env';
import 'tinymce/themes/silver/Theme';
import { PlatformDetection } from '@ephox/sand';

UnitTest.asynctest('TextcolorSanityTest', (success, failure) => {
  const browser = PlatformDetection.detect().browser;

  const forecolorStruct = ApproxStructure.build(function (s, str) {
    return s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.element('span', {
              styles: {
                color: str.is(Env.ie && Env.ie <= 11 ? '#3498db' : 'rgb(52, 152, 219)')
              }
            }),
            s.text(str.is(' test'))
          ]
        })
      ]
    });
  });

  const backcolorStruct = ApproxStructure.build(function (s, str) {
    return s.element('body', {
      children: [
        s.element('p', {
          children: [
            s.element('span', {
              styles: {
                'background-color': str.is('rgb(52, 152, 219)')
              }
            }),
            s.text(str.is(' test'))
          ]
        })
      ]
    });
  });

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const tinyApis = TinyApis(editor);
    const tinyUi = TinyUi(editor, {toolBarSelector: '.tox-toolbar'});

    Pipeline.async({}, browser.isIE() ? [] : [
      Log.stepsAsStep('TBA', 'TextColor: forecolor', [
        tinyApis.sFocus,
        tinyApis.sSetContent('hello test'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
        tinyUi.sClickOnToolbar('click forecolor', 'button[aria-label="Color"] + .tox-split-button__chevron'),
        tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
        tinyUi.sClickOnUi('click green color', 'div[data-mce-color="#1abc9c"]'),
        tinyUi.sClickOnToolbar('click forecolor again', 'button[aria-label="Color"] + .tox-split-button__chevron'),
        tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
        tinyUi.sClickOnUi('click blue color', 'div[data-mce-color="#3498db"]'),
        tinyApis.sAssertContentStructure(forecolorStruct)
      ]),
      Log.stepsAsStep('TBA', 'TextColor: backcolor', [
        tinyApis.sFocus,
        tinyApis.sSetContent('hello test'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
        tinyUi.sClickOnToolbar('click backcolor', 'button[aria-label="Background Color"] + .tox-split-button__chevron'),
        tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
        tinyUi.sClickOnUi('click green color', 'div[data-mce-color="#1abc9c"]'),
        tinyUi.sClickOnToolbar('click backcolor again', 'button[aria-label="Background Color"] + .tox-split-button__chevron'),
        tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
        tinyUi.sClickOnUi('click a nice purple color', 'div[data-mce-color="#3498db"]'),
        tinyApis.sAssertContentStructure(backcolorStruct)
      ])
    ], onSuccess, onFailure);
  }, {
    plugins: '',
    toolbar: 'forecolor backcolor fontsizeselect',
    skin_url: '/project/js/tinymce/skins/oxide'
  }, success, failure);
});