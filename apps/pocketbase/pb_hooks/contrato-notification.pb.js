/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const nomeCompleto = e.record.get("nomeCompleto");
  const whatsapp = e.record.get("whatsapp");
  const materiasEscolhidas = e.record.get("materiasEscolhidas");
  const planoSelecionado = e.record.get("planoSelecionado");
  const precoTotal = e.record.get("precoTotal");
  const created = e.record.get("created");
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: $app.settings().meta.senderAddress }],
    subject: "Novo Contrato Criado - " + nomeCompleto,
    html: "<h2>Novo Contrato Registrado</h2>" +
          "<p><strong>Nome:</strong> " + nomeCompleto + "</p>" +
          "<p><strong>WhatsApp:</strong> " + whatsapp + "</p>" +
          "<p><strong>Plano Selecionado:</strong> " + planoSelecionado + "</p>" +
          "<p><strong>Matérias Escolhidas:</strong> " + materiasEscolhidas + "</p>" +
          "<p><strong>Preço Total:</strong> R$ " + precoTotal + "</p>" +
          "<p><strong>Data/Hora:</strong> " + created + "</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "contratos");