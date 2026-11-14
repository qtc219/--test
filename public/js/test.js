//测试代码
$(function () {
            console.log('DOM 就绪，能找到 occurrence 吗:', $('#occurrence').length);
            // 1. 检查各个库是否到位
            console.log('===== 依赖自检 =====');
            console.log('jQuery 版本:', typeof $ !== 'undefined' ? $.fn.jquery : '❌ 未加载');
            console.log('Bootstrap 插件:', typeof $.fn.modal !== 'undefined' ? '✅ 已加载' : '❌ 未加载');
            console.log('datepicker 插件:', typeof $.fn.datepicker !== 'undefined' ? '✅ 已加载' : '❌ 未加载');
            console.log('中文语言包:', $.fn.datepicker && $.fn.datepicker.dates['zh-CN'] ? '✅ 已加载' : '❌ 未加载');
            console.log('当前 jQuery 语言:', typeof $.fn.datepicker !== 'undefined' && $.fn.datepicker.defaults ? $.fn.datepicker.defaults.language : '未知');

            // 2. 检查 CSS 是否真的生效（Bootstrap 会把 body 的字体改成 Helvetica 系）
            var bodyFont = getComputedStyle(document.body).fontFamily;
            console.log('Bootstrap CSS:', bodyFont.indexOf('Helvetica') > -1 || bodyFont.indexOf('system-ui') > -1 ? '✅ 生效' : '⚠ 可能没生效，字体为 ' + bodyFont);

            // 3. 初始化日期选择器
            $('#occurrence').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                todayHighlight: true,
                clearBtn: true
            });

            // 4. 弹出/选中的时候打个招呼，确认交互链路是通的
            $('#occurrence').on('show', function () {
                console.log('📅 日历已弹出');
            }).on('changeDate', function (e) {
                console.log('✅ 选中日期:', e.format('yyyy-mm-dd'));
            });
        });
