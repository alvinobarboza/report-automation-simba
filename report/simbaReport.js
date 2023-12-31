import excel from 'excel4node';
import {
    getCurrentMonth,
    getCurrentYear,
    getDateRange,
} from '../utils/dateManipulation.js';
import * as ExcelStyles from '../utils/excelStyles.js';
import './types.js';
import * as File from '../utils/fileHandler.js';

/**@param {DealerData[]} dealerData */
export async function writeProgramadorasReportSimba(dealerData) {
    try {
        const stringDate = getDateRange();
        const amount = dealerData.reduce(
            (acc, curr) => (acc += curr.totalCustomersActive),
            0
        );

        const constantValuesResultSheetHeader = [
            'COMPÊTENCIA',
            'NUMERO DE ASSINANTES',
            'VALOR UNITARIO POR ASSINANTES',
            'MÍNIMO GARANTIDO',
            'VALOR EM REAIS TOTAL A SER FATURADO (MG)',
        ];
        const constantValuesProvidersSheetHeader = [
            'Provedor (nome fantasia)',
            'Razão social',
            'CNPJ',
            'Cidade/Estado',
            'Número de assinantes',
        ];
        const MAINHEADER =
            'OPERADORA: YOU CAST COMERCIO DE EQUIPAMENTOS ELETRONICOS LTDA';

        const workbook = new excel.Workbook({
            defaultFont: {
                color: '#000000',
                size: 12,
            },
        });

        const worksheetResult = workbook.addWorksheet('Operadora', {
            sheetView: {
                showGridLines: false,
            },
        });
        worksheetResult.row(1).setHeight(25);
        worksheetResult.column(1).setWidth(45);
        worksheetResult.column(2).setWidth(35);

        worksheetResult
            .cell(1, 1, 1, 2, true)
            .string(MAINHEADER)
            .style({
                ...ExcelStyles.headerStyleSimba,
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#ffff00',
                    fgColor: '#ffff00',
                },
            });
        for (let i = 0; i < constantValuesResultSheetHeader.length; i++) {
            switch (i) {
                case 0:
                    worksheetResult
                        .cell(i + 2, 1)
                        .string(constantValuesResultSheetHeader[i])
                        .style({
                            ...ExcelStyles.dataStyleSimba,
                            alignment: {
                                horizontal: ['center'],
                                vertical: ['center'],
                            },
                            border: {
                                ...ExcelStyles.dataStyleSimba.border,
                                top: {
                                    style: 'medium',
                                    color: '#000000',
                                },
                            },
                        });
                    break;
                case constantValuesResultSheetHeader.length - 1:
                    worksheetResult
                        .cell(i + 2, 1)
                        .string(constantValuesResultSheetHeader[i])
                        .style({
                            ...ExcelStyles.dataStyleSimba,
                            alignment: {
                                horizontal: ['center'],
                                vertical: ['center'],
                            },
                            border: {
                                ...ExcelStyles.dataStyleSimba.border,
                                bottom: {
                                    style: 'medium',
                                    color: '#000000',
                                },
                            },
                        });
                    break;
                default:
                    worksheetResult
                        .cell(i + 2, 1)
                        .string(constantValuesResultSheetHeader[i])
                        .style({
                            ...ExcelStyles.dataStyleSimba,
                            alignment: {
                                horizontal: ['center'],
                                vertical: ['center'],
                            },
                        });
                    break;
            }
        }

        worksheetResult
            .cell(2, 2)
            .string(stringDate)
            .style({
                ...ExcelStyles.dataStyleSimba,
                alignment: {
                    horizontal: ['center'],
                    vertical: ['center'],
                },
                border: {
                    ...ExcelStyles.dataStyleSimba.border,
                    top: {
                        style: 'medium',
                        color: '#000000',
                    },
                },
            });
        worksheetResult
            .cell(3, 2)
            .number(amount)
            .style({
                ...ExcelStyles.dataStyleSimba,
                alignment: {
                    horizontal: ['center'],
                    vertical: ['center'],
                },
            });
        worksheetResult
            .cell(4, 2)
            .number(1.69)
            .style({
                ...ExcelStyles.dataStyleSimba,
                alignment: {
                    horizontal: ['center'],
                    vertical: ['center'],
                },
                numberFormat: 'R$ #.#0',
            });
        worksheetResult
            .cell(5, 2)
            .string('R$ 0,00')
            .style({
                ...ExcelStyles.dataStyleSimba,
                alignment: {
                    horizontal: ['center'],
                    vertical: ['center'],
                },
            });
        worksheetResult
            .cell(6, 2)
            .number(amount * 1.69)
            .style({
                ...ExcelStyles.dataStyleSimba,
                alignment: {
                    horizontal: ['center'],
                    vertical: ['center'],
                },
                border: {
                    ...ExcelStyles.dataStyleSimba.border,
                    bottom: {
                        style: 'medium',
                        color: '#000000',
                    },
                },
                numberFormat: 'R$ #.#0',
            });

        //=====================================Provedores=======================================

        const worksheetProviders = workbook.addWorksheet('Provedores', {
            sheetView: {
                showGridLines: false,
            },
        });
        worksheetProviders.row(1).setHeight(25);
        worksheetProviders.row(1).filter();
        worksheetProviders.column(1).setWidth(30);
        worksheetProviders.column(2).setWidth(50);
        worksheetProviders.column(3).setWidth(25);
        worksheetProviders.column(4).setWidth(30);
        worksheetProviders.column(5).setWidth(30);

        for (let i = 0; i < constantValuesProvidersSheetHeader.length; i++) {
            worksheetProviders
                .cell(1, i + 1)
                .string(constantValuesProvidersSheetHeader[i])
                .style(ExcelStyles.headerStyleSimba);
        }

        let rowCounter = 0;
        for (const dealer of dealerData) {
            if (dealer.totalCustomersActive) {
                worksheetProviders
                    .cell(rowCounter + 2, 1)
                    .string(
                        dealer.dealerNomeFantasia
                            ? dealer.dealerNomeFantasia.toUpperCase()
                            : dealer.dealerName.toUpperCase()
                    )
                    .style({
                        ...ExcelStyles.dataStyleSimbaProviders,
                        alignment: { horizontal: ['left'] },
                    });
                worksheetProviders
                    .cell(rowCounter + 2, 2)
                    .string(dealer.dealerRazaoSocial.toUpperCase())
                    .style({
                        ...ExcelStyles.dataStyleSimbaProviders,
                        alignment: { horizontal: ['left'] },
                    });
                worksheetProviders
                    .cell(rowCounter + 2, 3)
                    .string(dealer.dealerCnpj.toUpperCase())
                    .style({
                        ...ExcelStyles.dataStyleSimbaProviders,
                        alignment: { horizontal: ['center'] },
                    });
                worksheetProviders
                    .cell(rowCounter + 2, 4)
                    .string(
                        `${dealer.dealerCidade}/${dealer.dealerUf}`.toUpperCase()
                    )
                    .style({
                        ...ExcelStyles.dataStyleSimbaProviders,
                        alignment: { horizontal: ['left'] },
                    });
                worksheetProviders
                    .cell(rowCounter + 2, 5)
                    .number(dealer.totalCustomersActive)
                    .style({
                        ...ExcelStyles.dataStyleSimbaProviders,
                        alignment: { horizontal: ['center'] },
                    });

                rowCounter++;
            }
        }

        //============================================================================
        const filename = File.getPath(
            `RELATORIO DE ASSINANTES - SIMBA - Ref. ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
        );
        File.insertFilenameToFilenames(filename);
        await workbook.write(filename);
    } catch (error) {
        console.log(error);
    }
}
