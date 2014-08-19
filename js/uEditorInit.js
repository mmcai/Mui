$(function () {
    UE.getEditor('myEditor', {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
        toolbars: [['FullScreen', 'Source', 'Undo', 'Redo', 'Bold', 'test']],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        //默认的编辑区域高度
        initialFrameHeight: 300
        //更多其他参数，请参考ueditor.config.js中的配置项
        //serverUrl: 'Server/controller.js'
    });
});