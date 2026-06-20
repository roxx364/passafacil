/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const nomeCompleto = e.record.get("nomeCompleto");
    const whatsapp = e.record.get("whatsapp");
    const planoSelecionado = e.record.get("planoSelecionado");
    const precoTotal = e.record.get("precoTotal");
    const materiasEscolhidas = e.record.get("materiasEscolhidas");
    
    // Get sender settings from PocketBase config
    const senderAddress = $app.settings().meta.senderAddress;
    const senderName = $app.settings().meta.senderName || "Sistema de Contratos";
    
    // Create confirmation email message
    const message = new MailerMessage({
      from: {
        address: senderAddress,
        name: senderName
      },
      to: [{ address: senderAddress }],
      subject: "Novo Contrato Criado - " + nomeCompleto,
      html: "<h2>Confirmação de Novo Contrato</h2>" +
            "<p><strong>Nome:</strong> " + nomeCompleto + "</p>" +
            "<p><strong>WhatsApp:</strong> " + whatsapp + "</p>" +
            "<p><strong>Plano Selecionado:</strong> " + planoSelecionado + "</p>" +
            "<p><strong>Matérias Escolhidas:</strong> " + materiasEscolhidas + "</p>" +
            "<p><strong>Preço Total:</strong> R$ " + precoTotal + "</p>" +
            "<p><strong>ID do Contrato:</strong> " + e.record.id + "</p>" +
            "<p>Contrato criado em: " + new Date().toLocaleString("pt-BR") + "</p>"
    });
    
    // Send the email
    $app.newMailClient().send(message);
    
  } catch (error) {
    // Log error but don't block contract creation
    console.log("Email send error: " + error.message);
  }
  
  // CRITICAL: Always call e.next() to continue execution
  e.next();
}, "contratos");